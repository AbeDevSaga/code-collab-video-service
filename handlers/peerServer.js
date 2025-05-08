const { ExpressPeerServer } = require('peer');

module.exports = (server) => {
  const peerServer = ExpressPeerServer(server, {
    debug: process.env.NODE_ENV !== 'production',
    path: '/peerjs',
    generateClientId: () => 
      (Math.random().toString(36) + '0000000000000000000').substr(2, 16),
    
    // Security middleware for PeerJS connections
    proxied: true,
    ssl: process.env.NODE_ENV === 'production',
    
    // Custom auth for PeerJS connections
    allow_discovery: true,
    alive_timeout: 60000,
  });

  // PeerJS server events
  peerServer.on('connection', (client) => {
    console.log(`Peer connected: ${client.getId()}`);
  });

  peerServer.on('disconnect', (client) => {
    console.log(`Peer disconnected: ${client.getId()}`);
  });

  return peerServer;
};