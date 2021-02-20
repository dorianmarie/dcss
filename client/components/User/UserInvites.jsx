import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getCohorts } from '@actions/cohort';
import { getInvites, setInvite } from '@actions/invite';
import { getScenariosByStatus } from '@actions/scenario';
import { getUsers } from '@actions/users';
import { SCENARIO_IS_PUBLIC } from '@components/Scenario/constants';
import {
  checkNotificationRules,
  createHTML,
  notify
} from '@components/Notification';
import {
  Button,
  Container,
  Dropdown,
  Grid,
  Header,
  Label,
  Menu,
  Modal
} from '@components/UI';
import UserInvitesList, {
  makeAcceptedInviteRedirectPath,
  INVITE_STATUS_PENDING,
  INVITE_STATUS_CANCEL,
  INVITE_STATUS_DECLINE,
  INVITE_STATUS_ACCEPT
} from '@components/User/UserInvitesList';
import withSocket, {
  CREATE_USER_CHANNEL,
  NEW_INVITATION,
  SET_INVITATION
} from '@hoc/withSocket';

import Layout from '@utils/Layout';

const isParticipantOnly = user => {
  const { roles = [] } = user;
  return roles.length === 1 && roles[0] === 'participant';
};

const isMissingUsers = (invites, usersById) => {
  const userIdMap = invites.reduce(
    (accum, { receiver_id, sender_id }) => ({
      ...accum,
      [receiver_id]: true,
      [sender_id]: true
    }),
    {}
  );

  return Object.keys(userIdMap).some(id => usersById[id] === undefined);
};

class UserInvites extends Component {
  constructor(props) {
    super(props);

    const { open = false } = this.props;

    this.state = {
      open
    };

    this.onNewInvitation = this.onNewInvitation.bind(this);
    this.onSetInvitation = this.onSetInvitation.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onOpen = this.onOpen.bind(this);
  }

  async refresh() {
    await this.props.getInvites();
    await this.props.getCohorts();
    await this.props.getScenariosByStatus(SCENARIO_IS_PUBLIC);

    if (isMissingUsers(this.props.invites, this.props.usersById)) {
      await this.props.getUsers(
        isParticipantOnly(this.props.user) ? 'available' : 'all'
      );
    }
  }

  async componentDidMount() {
    const { user } = this.props;
    this.props.socket.emit(CREATE_USER_CHANNEL, { user });
    this.props.socket.on(NEW_INVITATION, this.onNewInvitation);
    this.props.socket.on(SET_INVITATION, this.onSetInvitation);

    const { code, status } = this.props;

    if (code && status) {
      if (!this.props.invitesByCode[code]) {
        await this.props.getInvites();
      }

      await this.props.setInvite(this.props.invitesByCode[code].id, { status });

      if (
        status === INVITE_STATUS_PENDING ||
        status === INVITE_STATUS_CANCEL ||
        status === INVITE_STATUS_DECLINE
      ) {
        this.props.history.push(this.props.redirect);
        return;
      }

      if (status === INVITE_STATUS_ACCEPT) {
        // Entering a scenario run must always
        // begin with a full refresh of all state.
        // This ensures that all runs are always
        // only dependent on their URL for every
        // thing needed to begin.
        location.href = this.props.redirect;
        return;
      }

      return;
    }

    await this.refresh();
  }

  componentWillUnmount() {
    this.props.socket.off(NEW_INVITATION, this.onNewInvitation);
    this.props.socket.off(SET_INVITATION, this.onSetInvitation);
  }

  async onNewInvitation(notification) {
    await this.refresh();

    if (this.state.open) {
      return;
    }

    const canShowNotification = checkNotificationRules(
      this.props.state,
      notification.rules
    );

    if (!canShowNotification) {
      return;
    }

    if (notification.type === 'invite') {
      let className = notification.props.className || '';
      className += `n__container`;

      notification.props.className = className.trim();

      const { invite } = notification;

      if (notification.props.html) {
        const onClick = async (event, { value: status }) => {
          if (notify.queue.data.length) {
            notify.queue.remove(notify.queue.data[0]);
          }

          await this.props.setInvite(invite.id, { status });

          if (status === INVITE_STATUS_ACCEPT) {
            location.href = makeAcceptedInviteRedirectPath(invite);
            // this.props.history.push(
            //   makeAcceptedInviteRedirectPath(invite)
            // );
          }
        };

        notification.props.message = (
          <Fragment>
            <Container className="u__invite-html-container">
              <div
                dangerouslySetInnerHTML={createHTML(notification.props.html)}
              />
            </Container>
            <Button.Group fluid size="small">
              <Button
                className="primary"
                content="Accept"
                tabIndex="0"
                onClick={onClick}
                value={INVITE_STATUS_ACCEPT}
              />
              <Button.Or />
              <Button
                content="Decline"
                tabIndex="0"
                onClick={onClick}
                value={INVITE_STATUS_DECLINE}
              />
            </Button.Group>
          </Fragment>
        );
      }

      if (notification.props.time === 0) {
        notification.props.onDismiss = () => {
          console.log('onDismiss');
        };
      }

      notify(notification.props);
    }
  }

  async onSetInvitation() {
    await this.refresh();
  }

  onClose() {
    this.setState({ open: false });
  }

  onOpen() {
    notify.queue.clear();
    this.setState({ open: true });
  }

  render() {
    if (this.props.redirect) {
      return null;
    }

    const { onClose, onOpen } = this;
    const { open } = this.state;
    const { invites, user } = this.props;
    const pendingCount = invites.reduce((accum, invite) => {
      if (invite.status === 'pending') {
        accum++;
      }
      return accum;
    }, 0);

    const showPendingCount = pendingCount >= 100 ? '99+' : pendingCount;

    return (
      <Fragment>
        <Menu.Item.Tabbable name="invites" onClick={onOpen}>
          Invites
          {pendingCount ? (
            <Label
              circular
              floating
              color="red"
              size="tiny"
              aria-label={`There are ${showPendingCount} pending invitations.`}
              style={{ top: '0.1em', right: '1em' }}
            >
              {showPendingCount}
            </Label>
          ) : null}
        </Menu.Item.Tabbable>
        {open ? (
          <Modal.Accessible open>
            <Modal
              closeIcon
              role="dialog"
              aria-modal="true"
              size="small"
              onClose={onClose}
              open
            >
              <Header icon="mail" content="Invites" />
              <Modal.Content className="u__invite-container">
                <UserInvitesList onClose={onClose} />
              </Modal.Content>
              <Modal.Actions>
                <Grid>
                  <Grid.Row>
                    <Grid.Column>
                      <Button.Group fluid>
                        <Button tabIndex="0" size="large" onClick={onClose}>
                          Close
                        </Button>
                      </Button.Group>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Modal.Actions>
            </Modal>
          </Modal.Accessible>
        ) : null}
      </Fragment>
    );
  }
}

UserInvites.propTypes = {
  code: PropTypes.string,
  getInvites: PropTypes.func,
  getScenariosByStatus: PropTypes.func,
  getUsers: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  invites: PropTypes.array,
  invitesByCode: PropTypes.object,
  open: PropTypes.bool,
  redirect: PropTypes.string,
  setInvite: PropTypes.func,
  socket: PropTypes.object,
  state: PropTypes.object,
  status: PropTypes.number,
  user: PropTypes.object,
  usersById: PropTypes.object
};

UserInvites.defaultProps = {
  code: '',
  open: false,
  redirect: '',
  status: null
};

const mapStateToProps = (state, ownProps) => {
  const { invites, personas, user, usersById } = state;
  const invitesByCode = invites.reduce(
    (accum, invite) => ({
      ...accum,
      [invite.code]: invite
    }),
    {}
  );

  const status = Number(ownProps.status) || null;

  return { invites, invitesByCode, personas, state, status, user, usersById };
};

const mapDispatchToProps = dispatch => ({
  getCohorts: () => dispatch(getCohorts()),
  getInvites: () => dispatch(getInvites()),
  getScenariosByStatus: status => dispatch(getScenariosByStatus(status)),
  getUsers: limit => dispatch(getUsers(limit)),
  setInvite: (id, params) => dispatch(setInvite(id, params))
});

export default withSocket(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(UserInvites)
  )
);