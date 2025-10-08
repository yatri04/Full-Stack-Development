import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Header = () => {
  return (
    <header className="text-center py-5">
      <Container>
        <Row>
          <Col>
            <h1 className="header-title mb-3">
              ✨ My Todo List
            </h1>
            <p className="lead text-white-50 mb-0">
              Stay organized and productive with your personal task manager
            </p>
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
