import React, { useState, useEffect } from 'react';
import { Container, Table, Spinner, Alert, Button, Row, Col, Card } from 'react-bootstrap';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const codespace = process.env.REACT_APP_CODESPACE_NAME || 'localhost:3000';
      const protocol = codespace === 'localhost:3000' ? 'http' : 'https';
      const port = codespace === 'localhost:3000' ? ':8000' : '';
      const baseUrl = `${protocol}://${codespace}${port}`;
      const apiUrl = `${baseUrl}/api/workouts/`;
      
      console.log('Fetching workouts from:', apiUrl);
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Workouts data received:', data);
      
      // Handle both paginated and plain array responses
      const workoutsList = data.results ? data.results : Array.isArray(data) ? data : [];
      console.log('Workouts list:', workoutsList);
      
      setWorkouts(workoutsList);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setError('Failed to fetch workouts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Loading workouts...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" dismissible>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 fw-bold mb-2">💪 Workouts</h1>
          <p className="text-muted">Personalized workout suggestions and programs</p>
        </Col>
        <Col md={3} className="text-end">
          <Button 
            variant="primary" 
            onClick={fetchWorkouts}
            disabled={loading}
          >
            🔄 Refresh
          </Button>
        </Col>
      </Row>

      {workouts.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <h5>No workouts available</h5>
            <p className="text-muted">Check back soon for personalized workout suggestions</p>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body className="p-0">
            <Table striped bordered hover responsive className="mb-0">
              <thead className="table-dark">
                <tr>
                  <th className="text-white">ID</th>
                  <th className="text-white">Workout Name</th>
                  <th className="text-white">Description</th>
                  <th className="text-white text-center" style={{ width: '140px' }}>Duration</th>
                  <th className="text-white">Created Date</th>
                </tr>
              </thead>
              <tbody>
                {workouts.map((workout) => (
                  <tr key={workout.id}>
                    <td className="fw-bold">{workout.id}</td>
                    <td>
                      <span className="badge bg-danger">
                        {workout.name || 'N/A'}
                      </span>
                    </td>
                    <td>{workout.description || '—'}</td>
                    <td className="text-center">
                      <span className="badge bg-primary">
                        {workout.duration || 0} min
                      </span>
                    </td>
                    <td>{workout.created_at ? new Date(workout.created_at).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Workouts;
