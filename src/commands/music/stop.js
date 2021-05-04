module.exports = {
  cmd: "stop",
  aliases: [],
  description: "stop the music/speech",
  run(message) {
    const player = message.client.botGlobal.players.get(message.guild.id);
    player.stop();
  },
};
