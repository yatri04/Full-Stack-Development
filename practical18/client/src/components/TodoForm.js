import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';

const TodoForm = ({ onAddTodo }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    onAddTodo(formData);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    });
  };

  return (
    <Card className="todo-card mb-4 animate-fade-in">
      <Card.Body>
        <Card.Title className="text-center mb-4">
          <h4>📝 Add New Task</h4>
        </Card.Title>
        
        {showAlert && (
          <Alert variant="warning" className="animate-slide-in">
            Please enter a task title!
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Task Title *</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="What needs to be done?"
                  className="form-control-custom"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="form-control-custom"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="form-control-custom"
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add more details about this task..."
              className="form-control-custom"
            />
          </Form.Group>

          <div className="text-center">
            <Button 
              type="submit" 
              variant="primary" 
              className="btn-custom px-4"
              size="lg"
            >
              ➕ Add Task
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default TodoForm;
