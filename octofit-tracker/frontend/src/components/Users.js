import React, { useState, useEffect } from 'react';
import { Container, Table, Spinner, Alert, Button, Row, Col, Card } from 'react-bootstrap';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const codespace = process.env.REACT_APP_CODESPACE_NAME || 'localhost:3000';
      const protocol = codespace === 'localhost:3000' ? 'http' : 'https';
      const port = codespace === 'localhost:3000' ? ':8000' : '';
      const baseUrl = `${protocol}://${codespace}${port}`;
      const apiUrl = `${baseUrl}/api/users/`;
      
      console.log('Fetching users from:', apiUrl);
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Users data received:', data);
      
      // Handle both paginated and plain array responses
      const usersList = data.results ? data.results : Array.isArray(data) ? data : [];
      console.log('Users list:', usersList);
      
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Loading users...</p>
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
          <h1 className="display-5 fw-bold mb-2">Users</h1>
          <p className="text-muted">Manage platform users and profiles</p>
        </Col>
        <Col md={3} className="text-end">
          <Button 
            variant="primary" 
            onClick={fetchUsers}
            disabled={loading}
          >
            🔄 Refresh
          </Button>
        </Col>
      </Row>

      {users.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <h5>No users found</h5>
            <p className="text-muted">No user accounts are currently registered</p>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body className="p-0">
            <Table striped bordered hover responsive className="mb-0">
              <thead className="table-dark">
                <tr>
                  <th className="text-white">ID</th>
                  <th className="text-white">Username</th>
                  <th className="text-white">Email</th>
                  <th className="text-white">First Name</th>
                  <th className="text-white">Last Name</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="fw-bold">{user.id}</td>
                    <td>
                      <span className="badge bg-success">
                        {user.username || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <a href={`mailto:${user.email}`} className="text-decoration-none">
                        {user.email || '—'}
                      </a>
                    </td>
                    <td>{user.first_name || '—'}</td>
                    <td>{user.last_name || '—'}</td>
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

export default Users;
