module.exports = async (server, conn) => {
  console.log("New connection");
  //conn.setEncoding("utf8");
  server.clients.add(conn);

  conn.on("message", async (data) => {
    try {
      data = JSON.parse(data.trim());
      console.log(data);
    } catch (ex) {
      // ¯\_(ツ)_/¯
    }
  });

  conn.on("close", () => {
    console.log("New disconnection");
    server.clients.delete(conn);
  });
};