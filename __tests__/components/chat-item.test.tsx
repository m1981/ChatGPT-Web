// ChatItem.test.tsx

import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatItem } from '../../app/components/chat-list';

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
    render(<ChatItem {...props} />);

    // Check if the title is present
    expect(screen.getByText(props.title)).toBeInTheDocument();

    // The delete button icon should be in the document (assuming it's an SVG with a title "Delete")
    expect(screen.getByTitle('Delete')).toBeInTheDocument();
  });

  it('calls onClick prop when ChatItem is clicked', () => {
    render(<ChatItem {...props} />);

    // Find the ChatItem using role or testId and click it
    const chatItem = screen.getByTestId('chat-item');
    userEvent.click(chatItem);

    // Check if the mockOnClick was called
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete prop when delete icon is clicked', () => {
    render(<ChatItem {...props} />);

    // Click the delete button (you may need to find the button via role or testid depending on your setup)
    const deleteButton = screen.getByTitle('Delete');
    userEvent.click(deleteButton);

    // Stop propagation must be called to prevent the onClick of the parent chat item from being called
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('applies selected styles when ChatItem is selected', () => {
    const selectedProps = { ...props, selected: true };
    const { rerender } = render(<ChatItem {...selectedProps} />);

    // Find the ChatItem using role or testId and check for selected styles
    const chatItem = screen.getByTestId('chat-item');
    expect(chatItem).toHaveClass('chat-item-selected');

    // Rerender it with selected as false
    rerender(<ChatItem {...props} />);

    // Expect the selected class to be removed
    expect(chatItem).not.toHaveClass('chat-item-selected');
  });
});
