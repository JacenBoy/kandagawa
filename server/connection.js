module.exports = async (server, conn) => {
  console.log("New connection");
  conn.setEncoding("utf8");
  server.clients.add(conn);

  conn.on("data", async (data) => {
    try {
      data = JSON.parse(data.trim());
    } catch (ex) {
      // ¯\_(ツ)_/¯
    }
  });

  conn.on("end", () => {
    console.log("New disconnection");
    server.clients.delete(conn);
  });
};