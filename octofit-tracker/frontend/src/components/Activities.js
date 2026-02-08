import React, { useState, useEffect } from 'react';
import { Container, Table, Spinner, Alert, Button, Row, Col, Card } from 'react-bootstrap';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const codespace = process.env.REACT_APP_CODESPACE_NAME || 'localhost:3000';
      const protocol = codespace === 'localhost:3000' ? 'http' : 'https';
      const port = codespace === 'localhost:3000' ? ':8000' : '';
      const baseUrl = `${protocol}://${codespace}${port}`;
      const apiUrl = `${baseUrl}/api/activities/`;
      
      console.log('Fetching activities from:', apiUrl);
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Activity data received:', data);
      
      // Handle both paginated and plain array responses
      const activitiesList = data.results ? data.results : Array.isArray(data) ? data : [];
      console.log('Activities list:', activitiesList);
      
      setActivities(activitiesList);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError('Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Loading activities...</p>
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
          <h1 className="display-5 fw-bold mb-2">Activities</h1>
          <p className="text-muted">View and manage all fitness activities</p>
        </Col>
        <Col md={3} className="text-end">
          <Button 
            variant="primary" 
            onClick={fetchActivities}
            disabled={loading}
          >
            🔄 Refresh
          </Button>
        </Col>
      </Row>

      {activities.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <h5>No activities found</h5>
            <p className="text-muted">Start by creating a new activity</p>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body className="p-0">
            <Table striped bordered hover responsive className="mb-0">
              <thead className="table-dark">
                <tr>
                  <th className="text-white">ID</th>
                  <th className="text-white">Activity Name</th>
                  <th className="text-white">Description</th>
                  <th className="text-white">Created Date</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.id}>
                    <td className="fw-bold">{activity.id}</td>
                    <td>
                      <span className="badge bg-info text-dark">
                        {activity.name || 'N/A'}
                      </span>
                    </td>
                    <td>{activity.description || '—'}</td>
                    <td>{activity.created_at ? new Date(activity.created_at).toLocaleDateString() : '—'}</td>
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

export default Activities;
