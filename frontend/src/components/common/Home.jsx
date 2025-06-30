import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Nav, Button, Navbar } from 'react-bootstrap';
import AllCourses from './AllCourses';


const Home = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar expand="lg" style={{ background: 'linear-gradient(to right, #fc466b, #3f5efb)' }} variant="dark" className="py-3 shadow">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 text-warning">Study App</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="ms-auto gap-4">
              <Nav.Link as={Link} to="/" className="text-light fw-semibold">Home</Nav.Link>
              <Nav.Link as={Link} to="/login" className="text-light fw-semibold">Login</Nav.Link>
              <Nav.Link as={Link} to="/register" className="text-light fw-semibold">Register</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <div className="hero-section text-center text-shadow">
        <div className="overlay d-flex flex-column justify-content-center align-items-center h-100">
          <h1 className="display-4 fw-bold text-info">Small App, Big Dreams</h1>
          <p className="lead text-light-emphasis">Elevating Your Education with Modern Learning</p>
          <Link to="/register">
            <Button variant="light" size="lg" className="mt-3 fw-bold text-primary">🚀 Explore Courses</Button>
          </Link>
        </div>
      </div>

      {/* Trending Courses */}
      <Container className="my-5">
        <h2 className="text-center mb-4 fw-bold text-success">🔥 Trending Courses</h2>
        <AllCourses />
      </Container>
    </>
  );
};

export default Home;
