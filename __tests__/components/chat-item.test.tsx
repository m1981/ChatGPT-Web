// ChatItem.test.tsx

import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatItem } from '../../app/components/chat-list';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

// afterEach hook for cleaning up after each test
afterEach(cleanup);

// Any necessary setup for Jest mocks would go here


const TestWrapper = ({ children }) => (
  <DragDropContext onDragEnd={() => {}}>
    <Droppable droppableId="droppable-test-id">
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </DragDropContext>
);

describe('ChatItem Component', () => {
  const mockOnClick = jest.fn();
  const mockOnDelete = jest.fn();

  const props = {
    onClick: mockOnClick,
    onDelete: mockOnDelete,
    title: 'Test Chat',
    count: 5,
    time: '10:00 AM',
    selected: false,
    id: '123', // Ensure the ID is a string as expected by Draggable
    index: 1,
  };

  it('renders ChatItem with the correct content', () => {
    render(
      <TestWrapper>
        <ChatItem {...props} data-testid="chat-item" />
      </TestWrapper>
    );

    // Check if the title is present
    expect(screen.getByText(props.title)).toBeInTheDocument();

    // Assuming DeleteIcon renders an SVG with a title="Delete", which might not be the case
    // If this doesn't work, you may need a data-testid or alternative method to select the delete icon
    expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
  });

  it('calls onClick prop when ChatItem is clicked', async () => {
    render(
      <TestWrapper>
        <ChatItem {...props} data-testid="chat-item" />
      </TestWrapper>
    );

    // Use async version of click and provide a data-testid prop to the component
    await userEvent.click(screen.getByTestId('chat-item'));

    // Check if the mockOnClick was called
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });


  it('calls onDelete prop when delete icon is clicked', async () => {
    render(
      <TestWrapper>
        <ChatItem {...props} data-testid="chat-item" />
      </TestWrapper>
    );

    // You must prevent the click event from bubbling up to avoid triggering onClick on the parent
    // In your component, the click handler for the delete icon should call e.stopPropagation()
    await userEvent.click(screen.getByTestId('delete-icon'));

    expect(mockOnDelete).toHaveBeenCalled();
  });



  it('applies selected styles when ChatItem is selected', () => {
    const selectedProps = { ...props, selected: true };
    const { rerender, getByTestId } = render(
      <TestWrapper>
        <ChatItem {...selectedProps} data-testid="chat-item" />
      </TestWrapper>
    );

    expect(getByTestId('chat-item')).toHaveClass('chat-item-selected');

    // Rerender with selected as false
    rerender(
      <TestWrapper>
        <ChatItem {...props} data-testid="chat-item" />
      </TestWrapper>
    );

    // Expect the selected class to be removed from the new element
    expect(getByTestId('chat-item')).not.toHaveClass('chat-item-selected');
  });

});
