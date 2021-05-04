module.exports = {
  cmd: "skip",
  aliases: [],
  description: "skip a music",
  run(message) {
    const player = message.client.botGlobal.players.get(message.guild.id);
    player.skip();
  },
};
