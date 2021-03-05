import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Dropdown, Message } from '@components/UI';
import RichTextEditor from '@components/RichTextEditor';
import { type } from './meta';

const options = [
  { key: 'red', value: 'red', text: 'Red' },
  { key: 'orange', value: 'orange', text: 'Orange' },
  { key: 'yellow', value: 'yellow', text: 'Yellow' },
  { key: 'olive', value: 'olive', text: 'Olive' },
  { key: 'green', value: 'green', text: 'Green' },
  { key: 'teal', value: 'teal', text: 'Teal' },
  { key: 'blue', value: 'blue', text: 'Blue' },
  { key: 'violet', value: 'violet', text: 'Violet' },
  { key: 'purple', value: 'purple', text: 'Purple' },
  { key: 'pink', value: 'pink', text: 'Pink' },
  { key: 'brown', value: 'brown', text: 'Brown' },
  { key: 'grey', value: 'grey', text: 'Grey' }
];
class SuggestionEditor extends React.Component {
  constructor(props) {
    super(props);
    this.onColorChange = this.onColorChange.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
    this.onTextareaChange = this.onTextareaChange.bind(this);
  }
  onTextareaChange(html) {
    this.props.onChange({ ...this.props.value, html });
  }

  onVisibilityChange(event, { checked: open }) {
    this.props.onChange({ ...this.props.value, open });
  }

  onColorChange(event, { value: color }) {
    this.props.onChange({ ...this.props.value, color });
  }

  render() {
    const { onColorChange, onTextareaChange, onVisibilityChange } = this;
    const { color, html, open } = this.props.value;
    const selectedOption = options.find(option => option.key === color);
    return (
      <React.Fragment>
        <Dropdown
          search
          selection
          searchInput={{ type: 'string' }}
          options={options}
          defaultValue={selectedOption.key}
          onChange={onColorChange}
        />
        <Message color={color}>
          <RichTextEditor
            options={{
              buttons: 'suggestion',
              height: '150px'
            }}
            defaultValue={html}
            onChange={onTextareaChange}
          />
        </Message>
        <Checkbox
          name="open"
          label="Default to visible?"
          checked={open}
          onChange={onVisibilityChange}
        />
      </React.Fragment>
    );
  }
}

SuggestionEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  scenario: PropTypes.object,
  value: PropTypes.shape({
    id: PropTypes.string,
    color: PropTypes.string,
    html: PropTypes.string,
    open: PropTypes.bool,
    type: PropTypes.oneOf([type])
  })
};

export default SuggestionEditor;
