const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const net = require("net");
const WebSocket = require("ws");
const irsdk = require("node-irsdk");

const config = require("./config.json");

const iracing = irsdk.init({telemetryUpdateInterval: config.telemetryPoll});
//const server = new net.Server();

const server = new WebSocket.Server({port: config.port});

server.clients = new Set();
server.broadcast = (data) => {
  for (const client of server.clients) {
    client.send(data);
  }
};

(async () => {
  // Load events for our TCP listener
  const srvFiles = await readdir("./server/");
  console.log(`Loading ${srvFiles.length} server events`);
  srvFiles.forEach(e => {
    const eventName = e.split(".")[0];
    console.log(`Loading ${eventName}`);
    const event = require(`./server/${e}`);
    server.on(eventName, event.bind(null, server));
  });

  //server.listen(config.port);

  // Load events for our iRacing listener
  const irFiles = await readdir("./iracing/");
  console.log(`Loading ${irFiles.length} iRacing events`);
  irFiles.forEach(e => {
    const eventName = e.split(".")[0];
    console.log(`Loading ${eventName}`);
    const event = require(`./iracing/${e}`);
    iracing.on(eventName, event.bind(null, server));
  });
})();