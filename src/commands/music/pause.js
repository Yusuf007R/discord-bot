module.exports = {
  cmd: "pause",
  aliases: [],
  description: "pause current music/speech",
  run(message, args) {
    const player = message.client.botGlobal.players.get(
      message.client.guilds.id
    );
    player.pause();
    message.channel.send("Paused.");
  },
};
