/*
The above code defines two components, `ChatItem` and `ChatList`. The `ChatItem` component
renders individual chat items, and the `ChatList` component renders a list of `ChatItem` components.
The list supports drag and drop functionality to reorder chat items using the `@hello-pangea/dnd` library.
The components also utilize a chat store to manage the state of the sessions and perform actions
like selecting, deleting, and moving sessions.
 */

// Import the DeleteIcon SVG component, styles and necessary libraries
import DeleteIcon from "../icons/delete2.svg";
import styles from "./home.module.scss";
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";

// Import necessary hooks, locale and constants
import { useChatStore } from "../store";
import Locale from "../locales";
import { Link, useNavigate } from "react-router-dom";
import { Path } from "../constant";

// Define the ChatItem component which renders individual chat items
export function ChatItem(props: {
  onClick?: () => void;
  onDelete?: () => void;
  title: string;
  count: number;
  time: string;
  selected: boolean;
  id: number;
  index: number;
  narrow?: boolean;
}) {
  return (
    // Make the chat item draggable using Draggable component
    <Draggable draggableId={`${props.id}`} index={props.index}>
      {(provided) => (
        // Define the chat item's structure and styles
        <div
          className={`${styles["chat-item"]} ${
            props.selected && styles["chat-item-selected"]
          }`}
          onClick={props.onClick}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {/* Render narrow chat item if narrow prop is true */}
          {props.narrow ? (
            <div className={styles["chat-item-narrow"]}>{props.count}</div>
          ) : (
            // Render normal chat item with title and info
            <>
              <div className={styles["chat-item-title"]}>{props.title}</div>
            </>
          )}

          {/* Render the delete button */}
          <div className={styles["chat-item-delete"]} onClick={props.onDelete}>
            <DeleteIcon data-testid="delete-icon" />
          </div>
        </div>
      )}
    </Draggable>
  );
}

// Define the ChatList component which renders a list of ChatItem components
export function ChatList(props: { narrow?: boolean }) {
  // Use the chat store to get sessions and related actions
  const [sessions, selectedIndex, selectSession, removeSession, moveSession] =
    useChatStore((state) => [
      state.sessions,
      state.currentSessionIndex,
      state.selectSession,
      state.removeSession,
      state.moveSession,
    ]);
  const chatStore = useChatStore();
  const navigate = useNavigate();

  // Define the onDragEnd event handler for drag and drop operations
  const onDragEnd: OnDragEndResponder = (result) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }

    // If the item was dropped in the same position, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Move the session in the chat store
    moveSession(source.index, destination.index);
  };
  // Wrap the chat list in DragDropContext and Droppable components
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chat-list">
        {(provided) => (
          <div
            className={styles["chat-list"]}
            ref={provided.innerRef}
        {...provided.droppableProps}
      >
        {/* Map over the sessions and render a ChatItem component for each session */}
        {sessions.map((item, i) => (
          <ChatItem
            title={item.topic}
            time={item.lastUpdate}
            count={item.messages.length}
            key={item.id}
            id={item.id}
            index={i}
            selected={i === selectedIndex}
            onClick={() => {
              navigate(Path.Chat);
              selectSession(i);
            }}
            onDelete={() => {
              if (!props.narrow || confirm(Locale.Home.DeleteChat)) {
                chatStore.deleteSession(i);
              }
            }}
            narrow={props.narrow}
          />
        ))}
        {/* Add the Droppable placeholder for the drop position indicator */}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext>
);
}






