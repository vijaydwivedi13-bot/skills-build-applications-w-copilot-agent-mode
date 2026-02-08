import React, { useState, useEffect } from 'react';
import { Container, Table, Spinner, Alert, Button, Row, Col, Card } from 'react-bootstrap';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const codespace = process.env.REACT_APP_CODESPACE_NAME || 'localhost:3000';
      const protocol = codespace === 'localhost:3000' ? 'http' : 'https';
      const port = codespace === 'localhost:3000' ? ':8000' : '';
      const baseUrl = `${protocol}://${codespace}${port}`;
      const apiUrl = `${baseUrl}/api/leaderboard/`;
      
      console.log('Fetching leaderboard from:', apiUrl);
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Leaderboard data received:', data);
      
      // Handle both paginated and plain array responses
      const leaderboardList = data.results ? data.results : Array.isArray(data) ? data : [];
      console.log('Leaderboard list:', leaderboardList);
      
      setLeaderboard(leaderboardList);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (rank) => {
    if (rank === 0) return '🥇';
    if (rank === 1) return '🥈';
    if (rank === 2) return '🥉';
    return '🏅';
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Loading leaderboard...</p>
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
          <h1 className="display-5 fw-bold mb-2">🏆 Leaderboard</h1>
          <p className="text-muted">Top performing teams competing for glory</p>
        </Col>
        <Col md={3} className="text-end">
          <Button 
            variant="primary" 
            onClick={fetchLeaderboard}
            disabled={loading}
          >
            🔄 Refresh
          </Button>
        </Col>
      </Row>

      {leaderboard.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <h5>No leaderboard data available</h5>
            <p className="text-muted">Start competing to see rankings</p>
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body className="p-0">
            <Table striped bordered hover responsive className="mb-0">
              <thead className="table-dark">
                <tr>
                  <th className="text-white text-center" style={{ width: '80px' }}>Rank</th>
                  <th className="text-white">Team Name</th>
                  <th className="text-white text-center" style={{ width: '120px' }}>Score</th>
                  <th className="text-white text-center" style={{ width: '120px' }}>Members</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr key={entry.id || index} className={index < 3 ? 'table-success' : ''}>
                    <td className="text-center fw-bold">
                      {getMedalEmoji(index)} #{index + 1}
                    </td>
                    <td>
                      <span className="badge bg-primary">
                        {entry.team?.name || entry.team || 'N/A'}
                      </span>
                    </td>
                    <td className="text-center fw-bold">
                      <span className="badge bg-warning text-dark">
                        {entry.score || 0} pts
                      </span>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-secondary">
                        {entry.members_count || 0}
                      </span>
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

export default Leaderboard;
