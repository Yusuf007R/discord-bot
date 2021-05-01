module.exports = {
  cmd: "resume",
  aliases: [],
  description: "resume music/speech",
  run(message, args) {
    const player = message.client.botGlobal.players.get(
      message.client.guilds.id
    );
    player.resume();
    message.channel.send("Resumed.");
  },
};
