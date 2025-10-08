import React from 'react';
import { Card, ListGroup, Spinner, Alert } from 'react-bootstrap';
import TodoItem from './TodoItem';

const TodoList = ({ todos, loading, onUpdateTodo, onDeleteTodo, onToggleTodo }) => {
  if (loading) {
    return (
      <Card className="todo-card">
        <Card.Body className="text-center py-5">
          <Spinner animation="border" className="loading-spinner" />
          <p className="mt-3 text-muted">Loading your tasks...</p>
        </Card.Body>
      </Card>
    );
  }

  if (todos.length === 0) {
    return (
      <Card className="todo-card">
        <Card.Body className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h4>No tasks yet!</h4>
          <p>Add your first task above to get started.</p>
        </Card.Body>
      </Card>
    );
  }

  const completedTodos = todos.filter(todo => todo.completed);
  const pendingTodos = todos.filter(todo => !todo.completed);

  return (
    <div className="animate-fade-in">
      {pendingTodos.length > 0 && (
        <Card className="todo-card mb-4">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">
              📋 Pending Tasks ({pendingTodos.length})
            </h5>
          </Card.Header>
          <ListGroup variant="flush">
            {pendingTodos.map((todo, index) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onUpdateTodo={onUpdateTodo}
                onDeleteTodo={onDeleteTodo}
                onToggleTodo={onToggleTodo}
                index={index}
              />
            ))}
          </ListGroup>
        </Card>
      )}

      {completedTodos.length > 0 && (
        <Card className="todo-card">
          <Card.Header className="bg-success text-white">
            <h5 className="mb-0">
              ✅ Completed Tasks ({completedTodos.length})
            </h5>
          </Card.Header>
          <ListGroup variant="flush">
            {completedTodos.map((todo, index) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onUpdateTodo={onUpdateTodo}
                onDeleteTodo={onDeleteTodo}
                onToggleTodo={onToggleTodo}
                index={index}
              />
            ))}
          </ListGroup>
        </Card>
      )}
    </div>
  );
};

export default TodoList;
