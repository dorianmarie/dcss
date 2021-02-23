import React from 'react';
import PropTypes from 'prop-types';
import { Container, Form } from '@components/UI';
// import { defaultValue } from './';
import { type } from './meta';
import DataHeader from '@components/Slide/Components/DataHeader';
import ResponseRecall from '@components/Slide/Components/ResponseRecall/Editor';
import './TextResponse.css';
import '@components/Slide/SlideEditor/SlideEditor.css';

class TextResponseEditor extends React.Component {
  constructor(props) {
    super(props);
    const {
      header = '',
      prompt = '',
      placeholder = '',
      recallId = '',
      responseId = ''
    } = props.value;
    this.state = {
      header,
      prompt,
      placeholder,
      recallId,
      responseId
    };

    this.onChange = this.onChange.bind(this);
    this.onRecallChange = this.onRecallChange.bind(this);
    this.updateState = this.updateState.bind(this);
    this.delayedUpdateState = this.delayedUpdateState.bind(this);
    this.timeout = null;
  }

  // shouldComponentUpdate(newProps) {
  //   const fields = Object.getOwnPropertyNames(defaultValue({}));

  //   for (let field of fields) {
  //     if (newProps.value[field] !== this.props.value[field]) {
  //       return true;
  //     }
  //   }

  //   return true;
  // }

  componentWillUnmount() {
    clearTimeout(this.timeout);

    let shouldCallUpdateState = false;

    const fields = ['header', 'placeholder', 'prompt', 'recallId'];

    for (let field of fields) {
      if (this.props.value[field] !== this.state[field]) {
        shouldCallUpdateState = true;
        break;
      }
    }

    if (shouldCallUpdateState) {
      this.updateState();
    }
  }

  delayedUpdateState() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(this.updateState, 5000);
  }

  updateState() {
    const { header, prompt, placeholder, recallId, responseId } = this.state;
    this.props.onChange({
      header,
      prompt,
      placeholder,
      recallId,
      responseId,
      type
    });
  }

  onChange(event, { name, value }) {
    this.setState({ [name]: value }, this.delayedUpdateState);
  }

  onRecallChange({ recallId }) {
    this.setState({ recallId }, this.updateState);
  }

  render() {
    const { header, prompt, placeholder, recallId } = this.state;
    const { scenario, slideIndex } = this.props;
    const { onChange, onRecallChange, updateState } = this;
    const promptAriaLabel = 'Optional prompt to display before the input:';
    const placeholderAriaLabel = 'Placeholder text displayed inside the input:';

    return (
      <Form>
        <Container fluid>
          <ResponseRecall
            isEmbedded={true}
            value={{ recallId }}
            slideIndex={slideIndex}
            scenario={scenario}
            onChange={onRecallChange}
          />
          <Form.TextArea
            name="prompt"
            label={promptAriaLabel}
            aria-label={promptAriaLabel}
            rows={1}
            value={prompt}
            onChange={onChange}
            onBlur={updateState}
          />
          <Form.Input
            name="placeholder"
            label={placeholderAriaLabel}
            aria-label={placeholderAriaLabel}
            value={placeholder}
            onChange={onChange}
            onBlur={updateState}
          />
          <DataHeader
            content={header}
            onChange={onChange}
            onBlur={updateState}
          />
        </Container>
      </Form>
    );
  }
}

TextResponseEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  slideIndex: PropTypes.any,
  scenario: PropTypes.object,
  value: PropTypes.shape({
    id: PropTypes.string,
    placeholder: PropTypes.string,
    header: PropTypes.string,
    prompt: PropTypes.string,
    recallId: PropTypes.string,
    required: PropTypes.bool,
    responseId: PropTypes.string,
    type: PropTypes.oneOf([type])
  })
};

export default TextResponseEditor;
