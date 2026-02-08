import React, { useState, useEffect } from 'react';
import { Container, Table, Spinner, Alert, Button, Row, Col, Card } from 'react-bootstrap';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const codespace = process.env.REACT_APP_CODESPACE_NAME || 'localhost:3000';
      const protocol = codespace === 'localhost:3000' ? 'http' : 'https';
      const port = codespace === 'localhost:3000' ? ':8000' : '';
      const baseUrl = `${protocol}://${codespace}${port}`;
      const apiUrl = `${baseUrl}/api/teams/`;
      
      console.log('Fetching teams from:', apiUrl);
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Teams data received:', data);
      
      // Handle both paginated and plain array responses
      const teamsList = data.results ? data.results : Array.isArray(data) ? data : [];
      console.log('Teams list:', teamsList);
      
      setTeams(teamsList);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError('Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Loading teams...</p>
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
          <h1 className="display-5 fw-bold mb-2">Teams</h1>
          <p className="text-muted">Create and manage competitive fitness teams</p>
        </Col>
        <Col md={3} className="text-end">
          <Button 
            variant="primary" 
            onClick={fetchTeams}
            disabled={loading}
          >
            🔄 Refresh
          </Button>
        </Col>
      </Row>

      {teams.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <h5>No teams found</h5>
            <p className="text-muted">Create your first team to get started</p>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body className="p-0">
            <Table striped bordered hover responsive className="mb-0">
              <thead className="table-dark">
                <tr>
                  <th className="text-white">ID</th>
                  <th className="text-white">Team Name</th>
                  <th className="text-white">Description</th>
                  <th className="text-white">Captain ID</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => (
                  <tr key={team.id}>
                    <td className="fw-bold">{team.id}</td>
                    <td>
                      <span className="badge bg-warning text-dark">
                        {team.name || 'N/A'}
                      </span>
                    </td>
                    <td>{team.description || '—'}</td>
                    <td className="font-monospace">
                      {team.captain?._id || team.captain?.id || '—'}
                    </td>
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

export default Teams;
