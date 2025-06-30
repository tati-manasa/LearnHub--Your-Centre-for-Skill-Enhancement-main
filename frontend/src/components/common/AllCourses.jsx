import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from './AxiosInstance';
import { Button, Modal, Form } from 'react-bootstrap';
import { UserContext } from '../../App';
import { Link, useNavigate } from 'react-router-dom';
import { MDBCol, MDBInput, MDBRow } from "mdb-react-ui-kit";

const AllCourses = () => {
  const navigate = useNavigate();
  const { userLoggedIn } = useContext(UserContext) || {};
  const [allCourses, setAllCourses] = useState([]);
  const [filterTitle, setFilterTitle] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showModal, setShowModal] = useState([]);
  const [cardDetails, setCardDetails] = useState({
    cardholdername: '',
    cardnumber: '',
    cvvcode: '',
    expmonthyear: '',
  });

  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handleShow = (index, price, courseId, courseTitle) => {
    if (price.toLowerCase() === 'free') {
      handleSubmit(courseId);
      navigate(`/courseSection/${courseId}/${courseTitle}`);
    } else {
      const updatedModal = [...showModal];
      updatedModal[index] = true;
      setShowModal(updatedModal);
    }
  };

  const handleClose = (index) => {
    const updatedModal = [...showModal];
    updatedModal[index] = false;
    setShowModal(updatedModal);
  };

  const getAllCoursesUser = async () => {
    try {
      const res = await axiosInstance.get('api/user/getallcourses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setAllCourses(res.data.data);
        setShowModal(Array(res.data.data.length).fill(false));
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    getAllCoursesUser();
  }, []);

  const isPaidCourse = (course) => /\d/.test(course.C_price);

  const handleSubmit = async (courseId) => {
    try {
      const res = await axiosInstance.post(
        `api/user/enrolledcourse/${courseId}`,
        cardDetails,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(res.data.message);
      if (res.data.course) {
        navigate(`/courseSection/${res.data.course.id}/${res.data.course.Title}`);
      }
    } catch (error) {
      console.error('Error during enrollment:', error);
      alert('Enrollment failed. Please try again.');
    }
  };

  const filteredCourses = allCourses
    .filter(course =>
      filterTitle === '' ||
      course.C_title?.toLowerCase().includes(filterTitle.toLowerCase())
    )
    .filter(course => {
      if (filterType === 'Free') return !isPaidCourse(course);
      if (filterType === 'Paid') return isPaidCourse(course);
      return true;
    });

  return (
    <>
      <div className="mt-4 text-center">
        <p className="mt-3">Search By:</p>
        <input
          type="text"
          placeholder="Title"
          value={filterTitle}
          onChange={(e) => setFilterTitle(e.target.value)}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Courses</option>
          <option value="Paid">Paid</option>
          <option value="Free">Free</option>
        </select>
      </div>

      <div className='p-2 course-container'>
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course, index) => (
            <div key={course._id} className='course'>
              <div className="card1">
                <div className="desc">
                  <h3>Modules</h3>
                  {course.sections?.length > 0 ? (
                    course.sections.slice(0, 2).map((section, i) => (
                      <div key={i}>
                        <p><b>Title:</b> {section.S_title}</p>
                        <div className="description-container">
                          <div className="description">
                            <b>Description:</b> {section.S_description}
                          </div>
                        </div>
                        <hr />
                      </div>
                    ))
                  ) : (
                    <p>No Modules</p>
                  )}
                  <p style={{ fontSize: 20, fontWeight: 600 }}>many more to watch...</p>
                </div>

                <div className="details">
                  <div className="center">
                    <h1>
                      {course.C_title}<br />
                      <span>{course.C_categories}</span><br />
                      <span style={{ fontSize: 10 }}>by: {course.C_educator}</span>
                    </h1>

                    <p>Sections: {course.sections?.length || 0}</p>
                    <p>Price (Rs.): {course.C_price}</p>
                    <p>Enrolled students: {course.enrolled}</p>

                    {userLoggedIn ? (
                      <>
                        <Button
                          variant='outline-dark'
                          size='sm'
                          onClick={() => handleShow(index, course.C_price, course._id, course.C_title)}
                        >
                          Start Course
                        </Button>

                        <Modal show={showModal[index]} onHide={() => handleClose(index)}>
                          <Modal.Header closeButton>
                            <Modal.Title>Payment for {course.C_title}</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <p><b>Educator:</b> {course.C_educator}</p>
                            <p><b>Price:</b> {course.C_price}</p>

                            <Form onSubmit={(e) => {
                              e.preventDefault();
                              handleSubmit(course._id);
                            }}>
                              <MDBInput
                                className='mb-2'
                                label="Card Holder Name"
                                name='cardholdername'
                                value={cardDetails.cardholdername}
                                onChange={handleChange}
                                type="text"
                                required
                              />
                              <MDBInput
                                className='mb-2'
                                name='cardnumber'
                                value={cardDetails.cardnumber}
                                onChange={handleChange}
                                label="Card Number"
                                type="text"
                                pattern="\d{16}"
                                placeholder="1234 5678 9012 3457"
                                required
                              />
                              <MDBRow className="mb-4">
                                <MDBCol md="6">
                                  <MDBInput
                                    name='expmonthyear'
                                    value={cardDetails.expmonthyear}
                                    onChange={handleChange}
                                    label="Expiration (MM/YYYY)"
                                    type="text"
                                    pattern="(0[1-9]|1[0-2])\/\d{4}"
                                    placeholder="MM/YYYY"
                                    required
                                  />
                                </MDBCol>
                                <MDBCol md="6">
                                  <MDBInput
                                    name='cvvcode'
                                    value={cardDetails.cvvcode}
                                    onChange={handleChange}
                                    label="CVV"
                                    type="text"
                                    pattern="\d{3}"
                                    placeholder="CVV"
                                    required
                                  />
                                </MDBCol>
                              </MDBRow>

                              <div className="d-flex justify-content-end">
                                <Button className='mx-2' variant="secondary" onClick={() => handleClose(index)}>
                                  Close
                                </Button>
                                <Button variant="primary" type='submit'>
                                  Pay Now
                                </Button>
                              </div>
                            </Form>
                          </Modal.Body>
                        </Modal>
                      </>
                    ) : (
                      <Link to="/login">
                        <Button variant='outline-dark' size='sm'>
                          Start Course
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className='text-center'>No courses at the moment</p>
        )}
      </div>
    </>
  );
};

export default AllCourses;