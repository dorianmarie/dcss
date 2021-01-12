import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import escapeRegExp from 'lodash.escaperegexp';
import {
  Button,
  Card,
  Grid,
  Header,
  Icon,
  Input,
  Menu,
  Pagination,
  Segment,
  Title
} from '@components/UI';
import {
  getCohorts,
  getCohortsCount,
  getCohortsSlice,
  getCohort,
  createCohort
} from '@actions/cohort';
import { getScenariosByStatus } from '@actions/scenario';
import { getUser } from '@actions/user';
import Gate from '@components/Gate';
import Loading from '@components/Loading';
import Layout from '@utils/Layout';
import { SCENARIO_IS_PUBLIC } from '@components/Scenario/constants';
import CohortCard from './CohortCard';
import CohortCreateWizard from './CohortCreateWizard';
import Identity from '@utils/Identity';
import '../ScenariosList/ScenariosList.css';

export class Cohorts extends React.Component {
  constructor(props) {
    super(props);

    const value = decodeURIComponent(window.location.search.replace('?q=', ''));
    const cohorts = this.props.cohorts;

    this.state = {
      activePage: 1,
      isReady: false,
      createIsVisible: false,
      cohorts,
      value
    };

    this.cohorts = cohorts;
    this.onCreateCohortCancel = this.onCreateCohortCancel.bind(this);
    this.onCreateCohortOpenClick = this.onCreateCohortOpenClick.bind(this);
    this.onCohortSearchChange = this.onCohortSearchChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }

  async componentDidMount() {
    await this.props.getUser();

    if (!this.props.user.id) {
      this.props.history.push('/logout');
    } else {
      const { value } = this.state;
      const count = await this.props.getCohortsCount();

      if (count <= this.props.cohorts.length) {
        this.cohorts = this.props.cohorts;

        this.setState({
          isReady: true
        });

        if (value) {
          this.onCohortSearchChange({}, { value });
        }
      } else {
        const limit = 20;
        let offset = 0;
        let sliceLength = 0;
        do {
          await this.props.getCohortsSlice('DESC', offset, limit);

          this.cohorts = this.props.cohorts;
          this.setState({
            isReady: true
          });

          if (value) {
            this.onCohortSearchChange({}, { value });
          }

          offset += limit;
        } while (offset < count);
      }
    }
    await this.props.getScenariosByStatus(SCENARIO_IS_PUBLIC);
  }

  onCreateCohortCancel() {
    this.setState({ createIsVisible: false });
  }

  onCreateCohortOpenClick() {
    this.setState({ createIsVisible: true });
  }

  onCohortSearchChange(event, props) {
    const { cohorts: sourceCohorts, scenarios } = this.props;
    const { value } = props;

    if (value === '') {
      this.setState({
        activePage: 1,
        cohorts: sourceCohorts
      });

      this.props.history.push(`${this.props.location.pathname}`);

      return;
    }

    const escapedRegExp = new RegExp(escapeRegExp(value), 'i');
    const lookupScenario = id => {
      return (
        scenarios.find(scenario => scenario.id === id) || {
          title: '',
          description: ''
        }
      );
    };

    const results = sourceCohorts.filter(record => {
      const { name, scenarios, users } = record;

      if (escapedRegExp.test(name)) {
        return true;
      }

      if (users.some(({ username }) => escapedRegExp.test(username))) {
        return true;
      }

      if (
        scenarios.some(
          id =>
            escapedRegExp.test(lookupScenario(id).title) ||
            escapedRegExp.test(lookupScenario(id).description)
        )
      ) {
        return true;
      }
      return false;
    });

    if (results.length === 0) {
      results.push(...sourceCohorts);
    }

    this.setState({
      activePage: 1,
      cohorts: results,
      value
    });

    this.props.history.push(
      `${this.props.location.pathname}?q=${encodeURIComponent(value)}`
    );
  }

  onPageChange(event, { activePage }) {
    this.setState({
      activePage
    });
  }

  render() {
    const { activePage, isReady, createIsVisible, value } = this.state;
    const {
      onCreateCohortCancel,
      onCohortSearchChange,
      onCreateCohortOpenClick,
      onPageChange
    } = this;

    // If there's an active search, use the search filtered set
    // of cohorts from state. Otherwise, use the status filtered
    // set from this.cohorts (the untouched backup).
    let cohorts = value ? this.state.cohorts : this.cohorts.slice(0);

    const { permissions } = this.props;

    const createCohortButton = (
      <Gate
        key="menu-item-create-cohort-auth"
        requiredPermission="create_cohort"
      >
        <Button
          fluid
          icon
          primary
          className="sc__hidden-on-mobile"
          labelPosition="left"
          name="Create a cohort"
          size="big"
          onClick={onCreateCohortOpenClick}
        >
          <Icon name="add" />
          Create a Cohort
        </Button>
      </Gate>
    );

    const menuItemCountCohorts = (
      <p>
        You are a part of <span className="c__list-num">{cohorts.length}</span>{' '}
        {cohorts.length === 1 ? 'cohort' : 'cohorts'}.
      </p>
    );

    const menuItemSearchCohorts = cohorts.length ? (
      <Menu.Menu
        className="grid__menu"
        key="menu-item-cohort-search"
        position="right"
      >
        <Input
          className="grid__menu-search"
          label="Search cohorts"
          icon="search"
          size="big"
          defaultValue={value || ''}
          onChange={onCohortSearchChange}
        />
      </Menu.Menu>
    ) : null;

    const cohortPermissionActions = [
      permissions.includes('create_cohort')
        ? createCohortButton
        : menuItemCountCohorts
    ];

    const defaultRowCount = 2;
    const {
      itemsPerRow,
      itemsPerPage,
      rowsPerPage
    } = Layout.computeItemsRowsPerPage({
      itemsColWidth: Layout.isForMobile() ? 320 : 320,
      itemsRowHeight: Layout.isForMobile() ? 200 : 300,
      itemsPerRow: 2,
      defaultRowCount
    });

    const cohortsPages = Math.ceil(cohorts.length / itemsPerPage);
    const cohortsIndex = (activePage - 1) * itemsPerPage;
    const cohortsSlice = cohorts.slice(
      cohortsIndex,
      cohortsIndex + itemsPerPage
    );
    const cards = cohortsSlice.map(cohort => {
      return <CohortCard key={Identity.key(cohort)} id={cohort.id} />;
    });

    const loadingProps = {
      card: { cols: itemsPerRow, rows: rowsPerPage, style: { height: '20rem' } }
    };

    const cardGroup = (
      <Card.Group.Stackable
        fallback="No cohorts yet!"
        itemsPerRow={itemsPerRow}
      >
        {cards}
      </Card.Group.Stackable>
    );

    const pageTitle = `Cohorts (${cohorts.length})`;
    return (
      <Fragment>
        <Title content={pageTitle} />
        <Grid className="grid__container" stackable columns={2}>
          <Grid.Column className="grid__sidebar" width={4}>
            <div className="grid__header">
              <Header as="h1" attached="top">
                Cohorts
              </Header>
              <Segment attached size="large">
                Cohorts are specific groups of participants (or your class)
                assigned to a scenario or set of scenarios.
              </Segment>
            </div>
            {cohortPermissionActions}
          </Grid.Column>
          <Grid.Column className="grid__main" width={12}>
            {menuItemSearchCohorts}
            <Grid>
              <Grid.Row>
                <Grid.Column stretched>
                  {!isReady ? <Loading {...loadingProps} /> : cardGroup}
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column stretched>
                  {cohortsPages > 1 ? (
                    <Pagination
                      borderless
                      name="cohorts"
                      siblingRange={1}
                      boundaryRange={0}
                      ellipsisItem={null}
                      firstItem={null}
                      lastItem={null}
                      activePage={activePage}
                      onPageChange={onPageChange}
                      totalPages={cohortsPages}
                    />
                  ) : null}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid>

        {createIsVisible ? (
          <CohortCreateWizard onCancel={onCreateCohortCancel} />
        ) : null}
      </Fragment>
    );
  }
}

Cohorts.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  cohorts: PropTypes.array,
  cohort: PropTypes.object,
  createCohort: PropTypes.func,
  getCohorts: PropTypes.func,
  getCohortsCount: PropTypes.func,
  getCohortsSlice: PropTypes.func,
  getCohort: PropTypes.func,
  getScenariosByStatus: PropTypes.func,
  ids: PropTypes.arrayOf(PropTypes.number),
  location: PropTypes.object,
  scenarios: PropTypes.array,
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape({
      id: PropTypes.node
    }).isRequired
  }).isRequired,
  getUser: PropTypes.func,
  user: PropTypes.object,
  permissions: PropTypes.array
};

const mapStateToProps = state => {
  const { permissions } = state.session;
  const { cohort, cohorts, scenarios, user } = state;
  return { cohort, cohorts, permissions, scenarios, user };
};

const mapDispatchToProps = dispatch => ({
  getCohorts: () => dispatch(getCohorts()),
  getCohortsCount: () => dispatch(getCohortsCount()),
  getCohortsSlice: (...params) => dispatch(getCohortsSlice(...params)),
  getCohort: id => dispatch(getCohort(id)),
  getScenariosByStatus: status => dispatch(getScenariosByStatus(status)),
  createCohort: params => dispatch(createCohort(params)),
  getUser: () => dispatch(getUser())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Cohorts)
);
