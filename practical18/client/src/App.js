import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import Header from './components/Header';
import { Container, Row, Col } from 'react-bootstrap';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch todos from API
  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add new todo
  const addTodo = async (todoData) => {
    try {
      const response = await fetch('http://localhost:5000/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      });
      const newTodo = await response.json();
      setTodos([newTodo, ...todos]);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  // Update todo
  const updateTodo = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      const updatedTodo = await response.json();
      setTodos(todos.map(todo => todo._id === id ? updatedTodo : todo));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: 'DELETE',
      });
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id, completed) => {
    const todo = todos.find(t => t._id === id);
    if (todo) {
      await updateTodo(id, { ...todo, completed: !completed });
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="App">
      <Header />
      <Container fluid className="py-4">
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8} xl={6}>
            <TodoForm onAddTodo={addTodo} />
            <TodoList 
              todos={todos} 
              loading={loading}
              onUpdateTodo={updateTodo}
              onDeleteTodo={deleteTodo}
              onToggleTodo={toggleTodo}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;