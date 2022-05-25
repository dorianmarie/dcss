import './scenarioEditor.css';

import {
  Button,
  Checkbox,
  Container,
  Form,
  Grid,
  Menu,
  Popup,
  Ref
} from '@components/UI';
import React, { Component, Fragment } from 'react';
import { getScenario, setScenario } from '@actions/scenario';

import DropdownCategories from './DropdownCategories';
import DropdownLabels from './DropdownLabels';
import DropdownOwner from './DropdownOwner';
import EditorMenu from '@components/EditorMenu';
import Gate from '@components/Gate';
import Identity from '@utils/Identity';
import Loading from '@components/Loading';
import PropTypes from 'prop-types';
import RichTextEditor from '@components/RichTextEditor';
import ScenarioAuthors from './ScenarioAuthors';
import ScenarioPersonas from './ScenarioPersonas';
import { connect } from 'react-redux';
import { getCategories } from '@actions/tags';
import { getUsersByPermission } from '@actions/users';
import { makeDefaultDescription } from '@components/Editor/scenario';
import { notify } from '@components/Notification';

function createSectionDef(label) {
  return {
    label,
    node: React.createRef(),
    offsetTop: 0
  };
}

class ScenarioEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      authors: [],
      reviewers: [],
      categories: []
    };

    this.leftcolRef = React.createRef();
    this.leftcol = {
      title: createSectionDef('Title'),
      description: createSectionDef('Description'),
      categories: createSectionDef('Categories'),
      labels: createSectionDef('Labels'),
      consentprose: createSectionDef('Consent Agreement'),
      finish: createSectionDef('Finish Slide')
    };

    this.debouncer = null;
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onConsentChange = this.onConsentChange.bind(this);
    this.onFinishSlideChange = this.onFinishSlideChange.bind(this);
    this.onBeforeUnload = this.onBeforeUnload.bind(this);
    this.scrollIntoView = this.scrollIntoView.bind(this);
  }

  onBeforeUnload() {
    if (this.props.scenarioId !== 'new') {
      this.onSubmit();
    }
  }

  componentWillUnmount() {
    if (this.debouncer) {
      clearTimeout(this.debouncer);
    }
    window.removeEventListener('beforeunload', this.onBeforeUnload);
  }

  async componentDidMount() {
    const {
      setScenario,
      getScenario,
      getUsersByPermission,
      getCategories,
      scenarioId,
      tags
    } = this.props;

    if (scenarioId === 'new') {
      setScenario(null);
    } else {
      await getScenario(scenarioId);
    }

    const authors = await getUsersByPermission('edit_scenario');

    let { categories } = tags;

    // Either the existing categories have been loaded,
    // or fetch categories to fill the default value
    if (!categories.length) {
      categories = await getCategories();
    }

    this.setState({
      isReady: true,
      categories,
      authors
    });

    window.addEventListener('beforeunload', this.onBeforeUnload);
  }

  async onChange(event, data) {
    const { name, value, checked } = data;

    const { scenario } = await this.props.setScenario({
      ...this.props.scenario,
      [name]: value || checked
    });

    // Only auto-save after scenario has been created.
    if (this.props.scenarioId !== 'new') {
      if (this.debouncer) {
        clearTimeout(this.debouncer);
      }
      this.debouncer = setTimeout(() => {
        this.onSubmit(scenario);
      }, 1000);
    }
  }

  onConsentChange(value) {
    let { id, prose } = this.props.scenario.consent;

    if (prose !== value) {
      id = null;
      prose = value;
      this.onChange(event, {
        name: 'consent',
        value: {
          id,
          prose
        }
      });
    }
  }

  onFinishSlideChange(html) {
    const {
      components: [existing],
      id,
      is_finish,
      title
    } = this.props.scenario.finish;

    if (!existing || (existing && existing.html !== html)) {
      this.onChange(event, {
        name: 'finish',
        value: {
          components: [{ html, type: 'Text' }],
          id,
          is_finish,
          title
        }
      });
    }
  }

  async onSubmit(updatedScenario) {
    const { postSubmitCB, submitCB } = this.props;
    const newScenario = updatedScenario || this.props.scenario;

    if (!newScenario.title) {
      notify({
        type: 'error',
        message: `Scenario title cannot be empty.`
      });
      return;
    }

    if (!newScenario.description) {
      // If description is any kind of falsy value, ensure that
      // it's saved as an empty string.
      newScenario.description = '';
    }

    // TODO: Move to own async action
    const response = await submitCB(newScenario);
    const { scenario, error } = await response.json();

    let type = 'success';
    let message = '';
    switch (response.status) {
      case 200: {
        message = 'Scenario saved';
        break;
      }
      case 201: {
        message = 'Scenario created';
        break;
      }
      default:
        if (error) {
          type = 'error';
          message = error.message;
        }
        break;
    }
    notify({ type, message });

    if (error) {
      return;
    }

    if (postSubmitCB) {
      postSubmitCB(scenario);
    }
  }

  scrollIntoView(name) {
    let top = this.leftcolRef.scrollHeight;
    Object.values(this.leftcol).forEach(({ offsetTop }) => {
      top = Math.min(top, offsetTop);
    });
    this.leftcolRef.scrollTo(0, this.leftcol[name].offsetTop - top);
  }

  render() {
    const {
      onChange,
      onConsentChange,
      onFinishSlideChange,
      scrollIntoView
    } = this;
    const {
      user,
      scenarioId,
      scenario,
      scenario: { author, categories, consent, finish, title }
    } = this.props;

    const { isReady } = this.state;
    const isNotNewScenario = scenarioId !== 'new';

    if (!isReady || !finish.components[0]) {
      return <Loading />;
    }

    const consentAgreementValue = consent.prose || '';
    const innerRef = (node, name) => {
      if (node) {
        this.leftcol[name].node = node;
        this.leftcol[name].offsetTop = node.offsetTop;
      }
    };

    const formInputTitle = (
      <Ref innerRef={node => innerRef(node, 'title')}>
        <Form.Field required>
          <label htmlFor="title">Title</label>
          <Form.Input
            focus
            autoComplete="off"
            id="title"
            name="title"
            value={title}
            onChange={onChange}
          />
        </Form.Field>
      </Ref>
    );

    const makeExampleCheckbox = (
      <Form.Field>
        <Checkbox
          label="Make this an example scenario"
          name="is_example"
          checked={scenario.is_example}
          onChange={onChange}
        />
      </Form.Field>
    );

    const descriptionDefaultValue =
      this.props.scenarioId === 'new'
        ? makeDefaultDescription(scenario)
        : scenario.description;

    const textAreaDescription = (
      <Ref innerRef={node => innerRef(node, 'description')}>
        <Form.Field>
          <label htmlFor="description">Description</label>
          <Form.TextArea
            required
            autoComplete="off"
            id="description"
            name="description"
            rows={2}
            value={descriptionDefaultValue}
            onChange={onChange}
          />
        </Form.Field>
      </Ref>
    );

    const rteConsent = isNotNewScenario ? (
      <Ref innerRef={node => innerRef(node, 'consentprose')}>
        <Form.Field required>
          <label htmlFor="consentprose">Consent Agreement</label>
          {consentAgreementValue ? (
            <RichTextEditor
              id="consentprose"
              name="consentprose"
              defaultValue={consent.prose}
              onChange={onConsentChange}
              options={{
                autoFocus: false,
                buttons: 'suggestion',
                minHeight: '150px',
                tabDisable: true
              }}
            />
          ) : null}
        </Form.Field>
      </Ref>
    ) : null;

    const rteFinish = isNotNewScenario ? (
      <Ref innerRef={node => innerRef(node, 'finish')}>
        <Form.Field>
          <label htmlFor="finish">
            After a scenario has been completed, the participant will be shown
            this:
          </label>
          <RichTextEditor
            id="finish"
            defaultValue={finish.components[0].html}
            onChange={onFinishSlideChange}
            options={{
              autoFocus: false,
              buttons: 'suggestion',
              minHeight: '200px',
              tabDisable: true
            }}
          />
        </Form.Field>
      </Ref>
    ) : null;

    const showOwnerDropdown =
      this.state.authors && this.state.authors.length && scenarioId === 'new';

    const showCategoryDropdown =
      this.state.categories && this.state.categories.length;

    const showLabelsDropdown = isNotNewScenario;

    const dropdowns = (
      <Gate requiredPermission="edit_scenario">
        {showOwnerDropdown ? (
          <DropdownOwner
            author={author}
            options={this.state.authors}
            onChange={onChange}
          />
        ) : null}
        {showCategoryDropdown ? (
          <Ref innerRef={node => innerRef(node, 'categories')}>
            <DropdownCategories
              options={this.state.categories}
              categories={categories}
              onChange={onChange}
            />
          </Ref>
        ) : null}
        {showLabelsDropdown ? (
          <Ref innerRef={node => innerRef(node, 'labels')}>
            <DropdownLabels labels={scenario.labels} onChange={onChange} />
          </Ref>
        ) : null}
      </Gate>
    );

    // This call is wrapped to prevent the form submit handler from
    // sending an event object to the "onSubmit" handler method.
    const onCreateScenarioClick = () => this.onSubmit();

    const popupProps =
      scenarioId === 'new'
        ? { size: 'large', position: 'right center', hideOnScroll: true }
        : { disabled: true };

    const leftColumnClassName = isNotNewScenario
      ? 'se__grid-column-height-constraint se__grid-column-width-constraint'
      : '';

    const left = Object.entries(this.leftcol).map(
      ([name, { label }], index) => (
        <Menu.Item.Tabbable
          icon
          key={Identity.key({ label, index })}
          onClick={() => scrollIntoView(name)}
        >
          {label}
        </Menu.Item.Tabbable>
      )
    );

    const editorMenu = isNotNewScenario ? (
      <EditorMenu
        text
        className="em__sticky se_em__sticky-special"
        type="scenario authors"
        items={{ left }}
      />
    ) : null;

    const styleHeight = {
      height: '500px'
    };
    const leftColBottomStyle = isNotNewScenario ? styleHeight : {};

    return (
      <Form>
        <Container fluid>
          <Grid columns={2} divided>
            <Grid.Row className="se__grid-nowrap">
              <Ref innerRef={node => (this.leftcolRef = node)}>
                <Grid.Column className={leftColumnClassName} width={8}>
                  {editorMenu}
                  <Popup
                    inverted
                    content="Enter a title for your scenario. This will appear on the scenario 'entry' slide."
                    trigger={formInputTitle}
                    {...popupProps}
                  />
                  <Popup
                    inverted
                    content="Enter a description for your scenario. This will appear on the scenario 'entry' slide."
                    trigger={textAreaDescription}
                    {...popupProps}
                  />

                  {user.is_super && makeExampleCheckbox}

                  {user.is_super && scenario.is_example && (
                    <Form.Field>
                      <label htmlFor="example_description">
                        Example Description
                      </label>
                      <Form.TextArea
                        autoComplete="off"
                        id="example_description"
                        name="example_description"
                        rows={2}
                        placeholder="What does this scenario demonstrate about Teacher Moments?"
                        value={scenario.example_description || ''}
                        onChange={onChange}
                      />
                    </Form.Field>
                  )}

                  {dropdowns}

                  {isNotNewScenario ? (
                    <Fragment>
                      {rteConsent}
                      {rteFinish}
                    </Fragment>
                  ) : (
                    <Button
                      type="submit"
                      primary
                      onClick={onCreateScenarioClick}
                    >
                      Create this scenario
                    </Button>
                  )}

                  <div style={leftColBottomStyle}></div>
                </Grid.Column>
              </Ref>
              <Grid.Column
                className="se__grid-column-width-constraint"
                width={8}
              >
                {isNotNewScenario ? (
                  <Fragment>
                    <ScenarioAuthors />
                    <ScenarioPersonas />
                  </Fragment>
                ) : null}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Form>
    );
  }
}

ScenarioEditor.propTypes = {
  getUsersByPermission: PropTypes.func.isRequired,
  getCategories: PropTypes.func.isRequired,
  getScenario: PropTypes.func.isRequired,
  postSubmitCB: PropTypes.func,
  scenarioId: PropTypes.node.isRequired,
  scenario: PropTypes.shape({
    author: PropTypes.object,
    categories: PropTypes.array,
    consent: PropTypes.shape({
      id: PropTypes.number,
      prose: PropTypes.string
    }),
    description: PropTypes.string,
    finish: PropTypes.object,
    labels: PropTypes.array,
    lock: PropTypes.object,
    status: PropTypes.number,
    title: PropTypes.string,
    users: PropTypes.array,
    is_example: PropTypes.bool,
    example_description: PropTypes.string
  }),
  setScenario: PropTypes.func.isRequired,
  submitCB: PropTypes.func.isRequired,
  tags: PropTypes.shape({
    categories: PropTypes.array
  }),
  user: PropTypes.object,
  users: PropTypes.array
};

const mapStateToProps = (state, ownProps) => {
  const { scenario, tags, user, users } = state;

  if (ownProps.scenarioId === 'new') {
    Object.assign(scenario.author, user);
  }
  return {
    // author,
    // categories,
    // consent,
    // description,
    // finish,
    // status,
    // title,
    scenario,
    tags,
    user,
    users
  };
};

const mapDispatchToProps = dispatch => ({
  getScenario: id => dispatch(getScenario(id)),
  setScenario: params => dispatch(setScenario(params)),
  getCategories: () => dispatch(getCategories()),
  getUsersByPermission: permission => dispatch(getUsersByPermission(permission))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScenarioEditor);
