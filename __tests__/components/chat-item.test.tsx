// ChatItem.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatItem } from '../../app/components/chat-list';
import { DragDropContext } from '@hello-pangea/dnd';

// Mocked DragDropContext for providing the necessary context
const MockDragDropContextProvider = ({ children }) => (
  <DragDropContext onDragEnd={() => {}}>{children}</DragDropContext>
);

describe('ChatItem Component', () => {
  // Define a basic mock function for click and delete handlers
  const mockOnClick = jest.fn();
  const mockOnDelete = jest.fn();

  // Create some dummy props for the item
  const props = {
    onClick: mockOnClick,
    onDelete: mockOnDelete,
    title: 'Test Chat',
    count: 5,
    time: '10:00 AM',
    selected: false,
    id: 123,
    index: 1,
  };

  it('renders ChatItem with the correct content', () => {
    render(
      <MockDragDropContextProvider>
        <ChatItem {...props} data-testid="chat-item" />
      </MockDragDropContextProvider>
    );

    // Check if the title is present
    expect(screen.getByText(props.title)).toBeInTheDocument();

    // Assuming DeleteIcon renders an SVG with a title="Delete", which might not be the case
    // If this doesn't work, you may need a data-testid or alternative method to select the delete icon
    expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
  });

  it('calls onClick prop when ChatItem is clicked', () => {
    render(
      <MockDragDropContextProvider>
        <ChatItem {...props} data-testid="chat-item" />
      </MockDragDropContextProvider>
    );

    // Trigger a click event on the ChatItem
    userEvent.click(screen.getByTestId('chat-item'));

    // Check if the mockOnClick was called
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete prop when delete icon is clicked', () => {
    render(
      <MockDragDropContextProvider>
        <ChatItem {...props} data-testid="chat-item" />
      </MockDragDropContextProvider>
    );

    // Click the delete button by testId
    userEvent.click(screen.getByTestId('delete-icon'));

    // Stop propagation must be called to prevent the onClick of the parent chat item from being called
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('applies selected styles when ChatItem is selected', () => {
    const selectedProps = { ...props, selected: true };
    render(
      <MockDragDropContextProvider>
        <ChatItem {...selectedProps} data-testid="chat-item" />
      </MockDragDropContextProvider>
    );

    // Check if the ChatItem has the 'selected' class
    expect(screen.getByTestId('chat-item')).toHaveClass('chat-item-selected');

    // Rerender with selected as false
    render(
      <MockDragDropContextProvider>
        <ChatItem {...props} data-testid="chat-item" />
      </MockDragDropContextProvider>
    );

    // Expect the selected class to be removed
    expect(screen.getByTestId('chat-item')).not.toHaveClass('chat-item-selected');
  });
});
