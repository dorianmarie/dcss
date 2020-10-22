import 'regenerator-runtime/runtime';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

if (window) {
  window.scrollTo = function() {};
  Element.prototype.scrollIntoView = function() {};
}

jest.mock('react-beautiful-dnd', () => ({
  Droppable: ({ children }) =>
    children(
      {
        draggableProps: {
          style: {}
        },
        innerRef: jest.fn()
      },
      {}
    ),
  Draggable: ({ children }) =>
    children(
      {
        draggableProps: {
          style: {}
        },
        innerRef: jest.fn()
      },
      {}
    ),
  DragDropContext: ({ children }) => children
}));
