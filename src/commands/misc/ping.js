module.exports = {
  cmd: "ping",
  description: "Ping!",
  run(message, args) {
    try {
      message.channel.send("Pong.");
    } catch (error) {
      console.log(error);
    }
  },
};