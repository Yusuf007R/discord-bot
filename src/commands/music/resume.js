module.exports = {
  cmd: "resume",
  aliases: [],
  description: "resume music/speech",
  run(message) {
    const player = message.client.botGlobal.players.get(message.guild.id);
    player.resume();
  },
};
