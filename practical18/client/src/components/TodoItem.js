import React, { useState } from 'react';
import { ListGroupItem, Row, Col, Button, Badge, Modal, Form } from 'react-bootstrap';
import { format, isAfter, isBefore, addDays } from 'date-fns';

const TodoItem = ({ todo, onUpdateTodo, onDeleteTodo, onToggleTodo }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description,
    priority: todo.priority,
    dueDate: todo.dueDate ? format(new Date(todo.dueDate), 'yyyy-MM-dd') : ''
  });

  const getPriorityBadge = (priority) => {
    const badges = {
      high: { variant: 'danger', text: '🔴 High' },
      medium: { variant: 'warning', text: '🟡 Medium' },
      low: { variant: 'info', text: '🟢 Low' }
    };
    return badges[priority] || badges.medium;
  };

  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return null;
    
    const today = new Date();
    const due = new Date(dueDate);
    const tomorrow = addDays(today, 1);
    
    if (isBefore(due, today)) {
      return { variant: 'danger', text: 'Overdue' };
    } else if (isBefore(due, tomorrow)) {
      return { variant: 'warning', text: 'Due Today' };
    } else if (isBefore(due, addDays(today, 3))) {
      return { variant: 'info', text: 'Due Soon' };
    }
    return null;
  };

  const handleEdit = () => {
    setEditData({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      dueDate: todo.dueDate ? format(new Date(todo.dueDate), 'yyyy-MM-dd') : ''
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    onUpdateTodo(todo._id, editData);
    setShowEditModal(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDeleteTodo(todo._id);
    }
  };

  const priorityBadge = getPriorityBadge(todo.priority);
  const dueDateStatus = getDueDateStatus(todo.dueDate);

  return (
    <>
      <ListGroupItem 
        className={`todo-item ${todo.completed ? 'completed' : ''} ${todo.priority}-priority animate-slide-in`}
        style={{ animationDelay: `${todo.index * 0.1}s` }}
      >
        <Row className="align-items-center">
          <Col xs={12} md={8}>
            <div className="d-flex align-items-center">
              <Form.Check
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggleTodo(todo._id, todo.completed)}
                className="me-3"
                style={{ transform: 'scale(1.2)' }}
              />
              <div className="flex-grow-1">
                <h6 className={`mb-1 ${todo.completed ? 'text-decoration-line-through text-muted' : ''}`}>
                  {todo.title}
                </h6>
                {todo.description && (
                  <p className={`mb-1 small ${todo.completed ? 'text-muted' : 'text-secondary'}`}>
                    {todo.description}
                  </p>
                )}
                <div className="d-flex flex-wrap gap-2">
                  <Badge bg={priorityBadge.variant} className="priority-badge">
                    {priorityBadge.text}
                  </Badge>
                  {todo.dueDate && (
                    <Badge 
                      bg={dueDateStatus?.variant || 'secondary'} 
                      className="priority-badge"
                    >
                      📅 {format(new Date(todo.dueDate), 'MMM dd, yyyy')}
                      {dueDateStatus && ` (${dueDateStatus.text})`}
                    </Badge>
                  )}
                  <Badge bg="light" text="dark" className="priority-badge">
                    {format(new Date(todo.createdAt), 'MMM dd')}
                  </Badge>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={12} md={4} className="text-end mt-2 mt-md-0">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleEdit}
              className="btn-custom me-2"
            >
              ✏️ Edit
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleDelete}
              className="btn-custom"
            >
              🗑️ Delete
            </Button>
          </Col>
        </Row>
      </ListGroupItem>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>✏️ Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Task Title</Form.Label>
              <Form.Control
                type="text"
                value={editData.title}
                onChange={(e) => setEditData({...editData, title: e.target.value})}
                className="form-control-custom"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={editData.description}
                onChange={(e) => setEditData({...editData, description: e.target.value})}
                className="form-control-custom"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={editData.priority}
                    onChange={(e) => setEditData({...editData, priority: e.target.value})}
                    className="form-control-custom"
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={editData.dueDate}
                    onChange={(e) => setEditData({...editData, dueDate: e.target.value})}
                    className="form-control-custom"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEdit} className="btn-custom">
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TodoItem;
