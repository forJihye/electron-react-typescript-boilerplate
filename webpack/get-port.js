const net = require('net');

/**
 * Get unused port
 * @return {Promise<number>}
 */
const getPort = () => new Promise((resolve) => {
  const server = net.createServer((socket) => {
    socket.end('Hello world\n');
  });
  server.listen(0, () => {
    resolve(server.address().port);
    server.close();
  })
})

/**
 * Check if the port is in use
 * @param {number} port 
 * @return {Promise<void|Error>}
 */
const checkPort = (port) => new Promise((resolve, reject) => {
  const server = net.createServer()
    .once('error', reject)
    .once('listening', () => {
      server
        .once('close', resolve)
        .close()
    })
    .listen(port);
});

module.exports = {
  getPort,
  checkPort
};