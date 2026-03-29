const http = require('http');
const { AccessToken } = require('livekit-server-sdk');

const LIVEKIT_API_KEY = 'APIZtuvW3iws6Ct';
const LIVEKIT_API_SECRET = '9VpAAvJo4hGcsKzydvyocJOMQUewX6mNlLfyl9t8o1e';

const server = http.createServer((req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.url.startsWith('/livekit/test-token/')) {
    const sessionId = req.url.split('/').pop() || 'test-room';
    const randomUserId = `test-user-${Math.floor(Math.random() * 1000)}`;
    
    try {
      const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
        identity: randomUserId,
        name: randomUserId,
      });
      at.addGrant({ roomJoin: true, room: sessionId });
      const token = at.toJwt();
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ token }));
    } catch (e) {
      console.error(e);
      res.writeHead(500);
      res.end('Error generating token');
    }
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(3000, () => {
  console.log('Mock LiveKit token server running on http://localhost:3000');
});
