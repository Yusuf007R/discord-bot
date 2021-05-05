module.exports = {
  cmd: "ping",
  categories: ["chat"],
  description: "Ping!",
  guildOnly: false,
  run(message) {
    try {
      message.channel.send("Pong.");
    } catch (error) {
      console.log(error);
    }
  },
};
