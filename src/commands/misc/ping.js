module.exports = {
  cmd: "ping",
  description: "Ping!",
  run(message) {
    try {
      message.channel.send("Pong.");
    } catch (error) {
      console.log(error);
    }
  },
};
