module.exports = async (server, evt) => {
  server.broadcast(JSON.stringify({"type": "telemetry", "data": evt}));
};