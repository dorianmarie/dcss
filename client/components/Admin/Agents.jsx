import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import escapeRegExp from 'lodash.escaperegexp';
import objectPath from 'object-path';
import pluralize from 'pluralize';
import PropTypes from 'prop-types';
import JSONTree from 'react-json-tree';
import { sentenceCase } from 'change-case';
import {
  createAgent,
  getAgent,
  getAgents,
  setAgent,
  getInteractions
} from '@actions/agent';
import AgentInterationSelect from './AgentInterationSelect';
import EditorMenu from '@components/EditorMenu';
import Loading from '@components/Loading';
import { notify } from '@components/Notification';
import Username from '@components/User/Username';
import {
  Button,
  Checkbox,
  Container,
  Divider,
  Dropdown,
  Grid,
  Form,
  Header,
  Icon,
  Input,
  List,
  Menu,
  Message,
  Modal,
  Pagination,
  Ref,
  Segment,
  Text,
  Table
} from '@components/UI';
import { agentInitialState } from '@reducers/initial-states';
import Identity from '@utils/Identity';
import { computeItemsRowsPerPage } from '@utils/Layout';
import Moment from '@utils/Moment';
import QueryString from '@utils/QueryString';
import './Agents.css';

function makeHistoryEntry(location, keyVals) {
  return `${location.pathname}?${QueryString.mergedStringify(keyVals)}`;
}

const AgentListItem = props => {
  const {
    active,
    agent: { name, description, id },
    onClick
  } = props;

  const ariaLabel = `${props.name}`;

  return (
    <List.Item
      as="a"
      aria-label={name}
      active={active}
      id={id}
      onClick={onClick}
    >
      <List.Content>
        <List.Header>{name}</List.Header>
        <List.Description>{description}</List.Description>
      </List.Content>
    </List.Item>
  );
};

AgentListItem.propTypes = {
  active: PropTypes.bool,
  agent: PropTypes.object,
  onClick: PropTypes.func
};

const makeListOfPropertyValuePairs = object => {
  if (Array.isArray(object)) {
    return object;
  }
  const pairs = Object.entries(object);
  return pairs.length
    ? pairs.map(([property, value]) => ({ property, value }))
    : [];
};

const makeRecordFromListOfPropertyValuePairs = list => {
  /* istanbul ignore next */
  if (!Array.isArray(list)) {
    return list;
  }
  return list.reduce(
    (accum, { property, value }) => ({ ...accum, [property]: value }),
    {}
  );
};

const makeStorableAgent = agent => {
  agent.socket = makeRecordFromListOfPropertyValuePairs(agent.socket);
  agent.configuration = makeRecordFromListOfPropertyValuePairs(
    agent.configuration
  );
  return agent;
};

const makeEditableAgent = agent => {
  agent.socket = makeListOfPropertyValuePairs(agent.socket);
  agent.configuration = makeListOfPropertyValuePairs(agent.configuration);
  return agent;
};

const makeMutabilitySafeAgent = (agent = agentInitialState) =>
  makeEditableAgent(JSON.parse(JSON.stringify(agent)));

class Agent extends Component {
  constructor(props) {
    super(props);

    const activePage = Number(this.props.activePage);

    this.state = {
      agent: null,
      confirmDelete: {
        isOpen: false
      },
      empty: {
        property: '',
        value: ''
      },
      error: {
        field: '',
        message: ''
      },
      activePage,
      isReady: false,
      id: null,
      results: []
    };

    this.agent = null;
    this.onChange = this.onChange.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.onOptionChange = this.onOptionChange.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.validateInput = this.validateInput.bind(this);
    this.createOrUpdateAgent = this.createOrUpdateAgent.bind(this);
  }

  async componentDidMount() {
    if (!this.props.agents.length) {
      await this.props.getAgents();
    }

    if (!this.props.interactions.length) {
      await this.props.getInteractions();
    }

    const id = this.props.id;
    let record = id ? this.props.agentsById[id] : null;

    if (id && !record) {
      record = await this.props.getAgent(id);
    }

    const agent = record ? makeMutabilitySafeAgent({ ...record }) : null;

    this.setState({
      isReady: true,
      agent,
      id
    });
  }

  async createOrUpdateAgent() {
    if (!this.validateInput()) {
      return;
    }

    const agent = makeStorableAgent(makeMutabilitySafeAgent(this.state.agent));

    if (agent.id) {
      await this.props.setAgent(agent.id, agent);
    } else {
      await this.props.createAgent(agent);
      this.props.history.push(
        makeHistoryEntry(this.props.location, {
          id: this.props.agent.id
        })
      );
    }
  }

  validateInput(input) {
    const agent = input || this.state.agent;

    if (!agent) {
      return false;
    }

    const { title, description, endpoint, interaction } = agent;

    let field = '';
    let message = '';

    if (!endpoint) {
      field = 'endpoint';
    }

    if (!description) {
      field = 'description';
    }

    if (!title) {
      field = 'title';
    }

    if (field && !message) {
      message = `${sentenceCase(field)} must not be empty.`;
    }

    if (interaction && !interaction.id) {
      field = 'interaction';
      message = 'Interaction must be selected.';
    }

    if (input) {
      if (message) {
        return false;
      }
      return true;
    }

    if (message) {
      notify({ message, color: 'red', time: 3000 });
      this.setState({
        error: {
          field,
          message
        }
      });
      return false;
    }
    return true;
  }

  /* istanbul ignore next */
  onPageChange(event, { activePage }) {
    /* istanbul ignore next */
    this.setState({
      ...this.state,
      activePage
    });
  }

  onSelect(event, { id }) {
    const agent = makeMutabilitySafeAgent({
      ...this.props.agentsById[id]
    });
    const error = {
      field: '',
      message: ''
    };
    this.setState({ agent, error, id });
    this.props.history.push(
      makeHistoryEntry(this.props.location, {
        id
      })
    );
  }

  onSearchChange(event, { value: search }) {
    if (search === '') {
      this.setState({
        activePage: 1,
        results: [],
        search
      });
      return;
    }

    if (search.length < 3) {
      return;
    }

    const escapedRegExp = new RegExp(escapeRegExp(search), 'i');
    const results = this.props.agents.filter(agent =>
      escapedRegExp.test(JSON.stringify(agent))
    );

    this.setState({
      activePage: 1,
      results,
      search
    });
  }

  onChange(event, { name, value, checked }) {
    if (typeof checked !== 'undefined') {
      value = checked;
    }

    const agent = this.state.agent;

    this.setState({
      agent: {
        ...agent,
        [name]: value
      }
    });
  }

  onSubmit() {
    this.createOrUpdateAgent();
  }

  onOptionChange(event, { index, name, path, value }) {
    if (index !== -1) {
      const agent = this.state.agent;

      agent[path][index][name] = value;

      this.setState({
        agent
      });
    } else {
      const empty = {
        ...this.state.empty,
        [name]: value
      };
      this.setState({
        empty
      });
    }
  }

  render() {
    const {
      createOrUpdateAgent,
      onChange,
      onPageChange,
      onOptionChange,
      onSelect,
      onSearchChange,
      onSubmit
    } = this;
    const { interactions } = this.props;
    const {
      agent,
      confirmDelete,
      error,
      isReady,
      activePage,
      search
    } = this.state;

    if (!isReady) {
      return <Loading />;
    }

    const defaultRowCount = 10;
    // known total height of all ui that is not a table row
    const totalUnavailableHeight = 559;
    const itemsRowHeight = 44;
    const itemsPerRow = 1;
    const { rowsPerPage } = computeItemsRowsPerPage({
      defaultRowCount,
      totalUnavailableHeight,
      itemsPerRow,
      itemsRowHeight
    });

    const selectedId = this.state.id || this.props.id || null;
    const sourceAgents = this.state.results.length
      ? this.state.results
      : this.props.agents;

    const agentsCount = sourceAgents.length;
    const pages = Math.ceil(agentsCount / rowsPerPage);
    const index = (activePage - 1) * rowsPerPage;
    const agents = sourceAgents.slice(index, index + rowsPerPage);
    const agentIcon = (
      <Menu.Item.Tabbable key="menu-item-agents-administration">
        <Icon.Group className="em__icon-group-margin">
          <Icon className="robot" />
        </Icon.Group>
        Agents
      </Menu.Item.Tabbable>
    );

    const onDeleteClick = (event, data) => {
      const { name, index, subject } = data;
      const record = agent[name][index];
      const item = (
        <code>
          {record.property} = {record.value}
        </code>
      );
      this.setState({
        confirmDelete: {
          isOpen: true,
          subject,
          item,
          onConfirm: () => {
            const agent = this.state.agent;
            agent[name].splice(index, 1);
            this.setState({
              agent
            });
          }
        }
      });
    };

    const addAgentButton = (
      <Menu.Item.Tabbable
        key="menu-item-agents-add"
        onClick={() => {
          const agent = makeMutabilitySafeAgent();
          this.setState({
            agent
          });
          this.props.history.push(
            makeHistoryEntry(this.props.location, {
              id: null
            })
          );
        }}
      >
        <Icon.Group className="em__icon-group-margin">
          <Icon name="plus" className="primary" />
        </Icon.Group>
        Add an agent
      </Menu.Item.Tabbable>
    );

    const resultsDisplay = this.state.results.length
      ? `matching '${search}'`
      : `nothing matches '${search}'`;

    const searchResults = search ? (
      <Menu.Item.Tabbable
        key="menu-item-search-results"
        aria-label="Search results"
      >
        Showing all agents, {resultsDisplay} (
        <strong>{this.state.results.length}</strong>)
      </Menu.Item.Tabbable>
    ) : null;

    const agentSearchInput = (
      <Menu.Menu
        key="menu-item-agents-search"
        name="Search agents"
        position="right"
      >
        {searchResults}
        <Menu.Item.Tabbable>
          <Input
            aria-label="Search agents"
            icon="search"
            placeholder="Search..."
            onChange={onSearchChange}
          />
        </Menu.Item.Tabbable>
      </Menu.Menu>
    );

    const duplicateAgentButton = agent ? (
      <Menu.Item.Tabbable
        key="menu-item-agent-duplicate"
        aria-label="Duplicate this agent"
        onClick={() => {
          const agent = makeMutabilitySafeAgent(this.state.agent);
          agent.id = null;
          this.setState({
            agent
          });
        }}
      >
        <Icon.Group className="em__icon-group-margin">
          <Icon name="copy outline" className="primary" />
        </Icon.Group>
        Duplicate this agent
      </Menu.Item.Tabbable>
    ) : null;

    const deleteAgentButton = agent ? (
      <Menu.Item.Tabbable
        key="menu-item-agent-delete"
        aria-label="Delete this agent"
        onClick={() => {
          this.setState({
            confirmDelete: {
              isOpen: true,
              subject: 'agent',
              item: agent.title,
              onConfirm: () => {
                const agent = makeStorableAgent(
                  makeMutabilitySafeAgent(this.state.agent)
                );
                this.props.setAgent(agent.id, {
                  ...agent,
                  deleted_at: new Date().toISOString()
                });
              }
            }
          });
        }}
      >
        <Icon.Group className="em__icon-group-margin">
          <Icon name="trash outline alternate" className="primary" />
        </Icon.Group>
        Delete this agent
      </Menu.Item.Tabbable>
    ) : null;

    const unsavedButValid = this.validateInput(agent);

    const unsavedAgent =
      unsavedButValid && !agent.id ? (
        <Menu.Item.Tabbable
          key="menu-item-agent-unsaved"
          aria-label="Agent is ready to be saved."
        >
          {agent.title ? (
            <Fragment>
              Click&nbsp;<strong>Save</strong>&nbsp;to activate this agent.
            </Fragment>
          ) : null}
        </Menu.Item.Tabbable>
      ) : null;

    const checked = agent && agent.id ? agent.is_active : unsavedButValid;

    const activeAgentCheckbox = agent ? (
      <Menu.Item.Tabbable key="menu-item-agent-active-checkbox">
        <Checkbox
          autoComplete="off"
          name="is_active"
          label="This agent is active"
          aria-label={checked ? 'agent is active' : 'agent is inactive'}
          checked={checked}
          disabled={agent && !agent.id}
          onChange={onChange}
        />
      </Menu.Item.Tabbable>
    ) : null;

    const onConfirmDeleteClose = () => {
      this.setState({
        confirmDelete: {
          isOpen: false
        }
      });
    };

    const interactionIdValue = agent ? agent.interaction.id : null;

    const interactionDropdownProps = {
      ...(error.field === 'interaction' && { error: true }),
      'aria-label': 'interaction',
      fluid: true,
      id: 'interaction',
      onSelect: interaction => {
        const agent = this.state.agent;
        /* istanbul ignore else */
        if (agent) {
          agent.interaction = {
            ...interaction
          };

          this.setState({
            agent
          });
        }
      },
      placeholder: 'Select an interaction',
      search: true,
      selection: true,
      value: interactionIdValue
    };

    const agentInteractionSelectProps = agent ? interactionDropdownProps : {};

    return (
      <Fragment>
        <EditorMenu
          type="agents"
          items={{
            left: [agentIcon, addAgentButton],
            right: [agentSearchInput]
          }}
        />
        <Grid celled className="a__agentviewer-outer">
          <Grid.Row>
            <Grid.Column width={4}>
              <List selection divided relaxed>
                {agents.map(agent => (
                  <AgentListItem
                    onClick={onSelect}
                    active={agent.id === selectedId}
                    agent={agent}
                    id={agent.id}
                    key={Identity.key(agent)}
                  />
                ))}
              </List>
            </Grid.Column>
            <Grid.Column className="a__agentviewer-inner" width={12}>
              {agent ? (
                <Grid.Row>
                  <Grid.Column>
                    <EditorMenu
                      className="a__agentviewer-editormenu"
                      type="agent"
                      items={{
                        left: [
                          !agent.id ? unsavedAgent : null,
                          agent.id ? duplicateAgentButton : null,
                          agent.id ? deleteAgentButton : null,
                          agent ? activeAgentCheckbox : null
                        ]
                      }}
                    />
                  </Grid.Column>
                </Grid.Row>
              ) : null}
              <Grid.Row>
                <Grid.Column>
                  {agent ? (
                    <Form onSubmit={onSubmit}>
                      <Form.Field required>
                        <label htmlFor="title">
                          Agent:{' '}
                          {error.field === 'title' ? (
                            <Text right error>
                              {error.message}
                            </Text>
                          ) : null}
                        </label>
                        <Form.Input
                          autoFocus
                          aria-label="title"
                          autoComplete="off"
                          name="title"
                          size="large"
                          value={agent.title}
                          onChange={onChange}
                          {...(error.field === 'title' && { error: true })}
                        />
                      </Form.Field>
                      <Form.Field required>
                        <label htmlFor="description">
                          Description:{' '}
                          {error.field === 'description' ? (
                            <Text right error>
                              {error.message}
                            </Text>
                          ) : null}
                        </label>
                        <Form.TextArea
                          aria-label="description"
                          autoComplete="off"
                          id="description"
                          name="description"
                          value={agent.description}
                          onChange={onChange}
                          {...(error.field === 'description' && {
                            error: true
                          })}
                        />
                      </Form.Field>
                      <Form.Field required>
                        <label htmlFor="endpoint">
                          Endoint:{' '}
                          {error.field === 'endpoint' ? (
                            <Text right error>
                              {error.message}
                            </Text>
                          ) : null}
                        </label>
                        <Form.Input
                          aria-label="endpoint"
                          autoComplete="off"
                          id="endpoint"
                          name="endpoint"
                          value={agent.endpoint}
                          onChange={onChange}
                          {...(error.field === 'description' && {
                            error: true
                          })}
                        />
                      </Form.Field>
                      <Form.Field required>
                        <label htmlFor="interaction">
                          Interaction:{' '}
                          {error.field === 'interaction' ? (
                            <Text right error>
                              {error.message}
                            </Text>
                          ) : null}
                        </label>
                        <AgentInterationSelect
                          {...agentInteractionSelectProps}
                        />
                        <Text color="grey" className="a__textpadding">
                          This is how the agent will interact with participant
                          input.
                        </Text>
                      </Form.Field>

                      {/* AGENT CONFIGURATION */}

                      <Divider horizontal>
                        <Header as="h4">
                          <Icon name="settings" />
                          Agent Configuration
                        </Header>
                      </Divider>

                      <Message>
                        These settings are used by the service that provides the
                        agent to configure characteristics of the agent.
                        Information stored here is typically provided by the
                        remote service. These values are sent to the agent when
                        socket connections are made.
                      </Message>

                      <Form.Field>
                        <label htmlFor="name">Name</label>
                        <Form.Input
                          aria-label="name"
                          autoComplete="off"
                          name="name"
                          value={agent.name}
                          onChange={onChange}
                        />
                      </Form.Field>

                      <div className="a__agentviewer-configuration">
                        <div className="a__config-key">
                          <strong>Key</strong>
                        </div>
                        <div className="a__config-value">
                          <strong>Value</strong>
                        </div>
                        <div className="a__config-action"> </div>
                        {agent.configuration.map(
                          ({ property, value }, index) => {
                            const baseKey = Identity.key({
                              configuration: true,
                              index
                            });
                            const item = (
                              <code>
                                {property} = {value}
                              </code>
                            );
                            return (
                              <Fragment key={baseKey}>
                                <div className="a__config-key">
                                  <Form.Field>
                                    <Form.Input
                                      fluid
                                      aria-label="Agent configuration key"
                                      autoComplete="off"
                                      name="property"
                                      path="configuration"
                                      value={property}
                                      index={index}
                                      onChange={onOptionChange}
                                    />
                                  </Form.Field>
                                </div>
                                <div className="a__config-value">
                                  <Form.Field>
                                    <Form.Input
                                      fluid
                                      aria-label="Agent configuration value"
                                      autoComplete="off"
                                      name="value"
                                      path="configuration"
                                      value={value}
                                      index={index}
                                      onChange={onOptionChange}
                                    />
                                  </Form.Field>
                                </div>
                                <div className="a__config-action">
                                  <Button
                                    fluid
                                    role="option"
                                    aria-label="Delete agent configuration"
                                    className="icon-primary a__tablebuttonicon"
                                    name="configuration"
                                    subject="agent configuration"
                                    index={index}
                                    item={item}
                                    tabIndex={0}
                                    onClick={onDeleteClick}
                                  >
                                    <Icon name="trash outline alternate" />
                                  </Button>
                                </div>
                              </Fragment>
                            );
                          }
                        )}

                        <div className="a__config-key">
                          <Form.Field>
                            <Form.Input
                              fluid
                              aria-label="New agent configuration key"
                              autoComplete="off"
                              key="empty-property"
                              name="property"
                              path="configuration"
                              placeholder="KEY"
                              value={this.state.empty.property}
                              index={-1}
                              onChange={onOptionChange}
                            />
                          </Form.Field>
                        </div>
                        <div className="a__config-value">
                          <Form.Field>
                            <Form.Input
                              fluid
                              aria-label="New agent configuration value"
                              autoComplete="off"
                              key="empty-value"
                              name="value"
                              path="configuration"
                              placeholder="VALUE"
                              value={this.state.empty.value}
                              index={-1}
                              onChange={onOptionChange}
                            />
                          </Form.Field>
                        </div>
                        <div className="a__config-action">
                          <Button
                            fluid
                            aria-label="Add agent configuration"
                            className="icon-primary a__tablebuttonicon"
                            disabled={
                              !this.state.empty.property ||
                              !this.state.empty.value
                            }
                            onClick={() => {
                              const agent = this.state.agent;
                              agent.configuration.push({
                                ...this.state.empty
                              });
                              this.setState({
                                agent,
                                empty: {
                                  property: '',
                                  value: ''
                                }
                              });
                            }}
                          >
                            <Icon name="plus" />
                          </Button>
                        </div>
                      </div>

                      {/* SOCKET CONFIGURATION */}

                      <Divider horizontal>
                        <Header as="h4">
                          <Icon name="settings" />
                          Socket Configuration
                        </Header>
                      </Divider>

                      <Message>
                        These settings are used for constructing the socket
                        object and must correspond to the options documented in{' '}
                        <a
                          href="https://socket.io/docs/v3/client-initialization/#Options"
                          target="_blank"
                        >
                          Socket.io&apos;s Client Initialization Options
                        </a>
                      </Message>

                      <div className="a__agentviewer-configuration">
                        <div className="a__config-key">
                          <strong>Key</strong>
                        </div>
                        <div className="a__config-value">
                          <strong>Value</strong>
                        </div>
                        <div className="a__config-action"> </div>
                        {agent.socket.map(({ property, value }, index) => {
                          const baseKey = Identity.key({ socket: true, index });
                          const item = (
                            <code>
                              {property} = {value}
                            </code>
                          );
                          return (
                            <Fragment key={baseKey}>
                              <div className="a__config-key">
                                <Form.Field>
                                  <Form.Input
                                    fluid
                                    aria-label="Socket configuration key"
                                    autoComplete="off"
                                    name="property"
                                    path="socket"
                                    value={property}
                                    index={index}
                                    onChange={onOptionChange}
                                  />
                                </Form.Field>
                              </div>
                              <div className="a__config-value">
                                <Form.Field>
                                  <Form.Input
                                    fluid
                                    aria-label="Socket configuration value"
                                    autoComplete="off"
                                    name="value"
                                    path="socket"
                                    value={value}
                                    index={index}
                                    onChange={onOptionChange}
                                  />
                                </Form.Field>
                              </div>
                              <div className="a__config-action">
                                <Button
                                  fluid
                                  aria-label="Delete socket configuration"
                                  key="remove"
                                  role="option"
                                  className="icon-primary a__tablebuttonicon"
                                  name="socket"
                                  subject="socket configuration"
                                  index={index}
                                  item={item}
                                  onClick={onDeleteClick}
                                >
                                  <Icon name="trash outline alternate" />
                                </Button>
                              </div>
                            </Fragment>
                          );
                        })}

                        <div className="a__config-key">
                          <Form.Field>
                            <Form.Input
                              fluid
                              aria-label="New socket configuration key"
                              autoComplete="off"
                              key="empty-property"
                              name="property"
                              path="socket"
                              placeholder="KEY"
                              value={this.state.empty.property}
                              index={-1}
                              onChange={onOptionChange}
                            />
                          </Form.Field>
                        </div>
                        <div className="a__config-value">
                          <Form.Field>
                            <Form.Input
                              fluid
                              aria-label="New socket configuration value"
                              autoComplete="off"
                              key="empty-value"
                              name="value"
                              path="socket"
                              placeholder="VALUE"
                              value={this.state.empty.value}
                              index={-1}
                              onChange={onOptionChange}
                            />
                          </Form.Field>
                        </div>
                        <div className="a__config-action">
                          <Button
                            fluid
                            aria-label="Add socket configuration"
                            className="icon-primary a__tablebuttonicon"
                            disabled={
                              !this.state.empty.property ||
                              !this.state.empty.value
                            }
                            onClick={() => {
                              const agent = this.state.agent;
                              agent.socket.push({
                                ...this.state.empty
                              });
                              this.setState({
                                agent,
                                empty: {
                                  property: '',
                                  value: ''
                                }
                              });
                            }}
                          >
                            <Icon name="plus" />
                          </Button>
                        </div>
                      </div>
                    </Form>
                  ) : (
                    <Message
                      icon="arrow left"
                      header="Agent viewer"
                      content="Select an agent to view and edit"
                    />
                  )}
                </Grid.Column>
              </Grid.Row>
              {agent ? (
                <Grid.Row>
                  <JSONTree
                    theme="monokai"
                    key={Identity.key({ agent, display: true })}
                    data={agent}
                    invertTheme={true}
                  />
                </Grid.Row>
              ) : null}

              {agent ? (
                <Grid.Row className="a__agentviewer-actions">
                  <Divider />
                  {/* SAVE or CANCEL */}

                  <Form.Field>
                    <Button.Group fluid>
                      <Button
                        primary
                        type="submit"
                        onClick={createOrUpdateAgent}
                      >
                        Save
                      </Button>
                      <Button.Or />
                      <Button
                        onClick={() => {
                          this.setState({
                            agent: null
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </Button.Group>
                  </Form.Field>
                  <div data-testid="agents-detail" />
                </Grid.Row>
              ) : null}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Pagination
          borderless
          name="agents"
          activePage={activePage}
          siblingRange={1}
          boundaryRange={0}
          ellipsisItem={null}
          firstItem={null}
          lastItem={null}
          onPageChange={onPageChange}
          totalPages={pages}
        />

        {confirmDelete.isOpen ? (
          <Modal.Accessible open>
            <Modal
              closeIcon
              open
              aria-modal="true"
              role="dialog"
              size="small"
              onClose={onConfirmDeleteClose}
            >
              <Header
                icon="trash alternate outline"
                content={`Delete this ${confirmDelete.subject}?`}
              />
              <Modal.Content>
                Are you sure you want to delete this {confirmDelete.subject}:{' '}
                {confirmDelete.item}?
              </Modal.Content>
              <Modal.Actions>
                <Button.Group fluid>
                  <Button
                    primary
                    aria-label="Yes"
                    onClick={() => {
                      confirmDelete.onConfirm();
                      onConfirmDeleteClose();
                    }}
                  >
                    Yes
                  </Button>
                  <Button.Or />
                  <Button aria-label="No" onClick={onConfirmDeleteClose}>
                    No
                  </Button>
                </Button.Group>
              </Modal.Actions>
              <div data-testid="agent-confirm-delete" />
            </Modal>
          </Modal.Accessible>
        ) : null}
        <div data-testid="agents-main" />
      </Fragment>
    );
  }
}

Agent.propTypes = {
  createAgent: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  location: PropTypes.object,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  activePage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  agent: PropTypes.object,
  agents: PropTypes.array,
  agentsById: PropTypes.object,
  interactions: PropTypes.array,
  interactionsById: PropTypes.object,
  setAgent: PropTypes.func,
  getAgent: PropTypes.func,
  getAgents: PropTypes.func,
  getInteractions: PropTypes.func,
  user: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const {
    user,
    agent,
    agents,
    agentsById,
    interactions,
    interactionsById
  } = state;

  const activePage = ownProps.activePage || 1;
  return {
    activePage,
    agent,
    agents,
    agentsById,
    interactions,
    interactionsById,
    user
  };
};

const mapDispatchToProps = dispatch => ({
  createAgent: params => dispatch(createAgent(params)),
  getAgent: id => dispatch(getAgent(id)),
  getAgents: params => dispatch(getAgents(params)),
  getInteractions: () => dispatch(getInteractions()),
  setAgent: (id, params) => dispatch(setAgent(id, params))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Agent)
);