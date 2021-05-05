module.exports = {
  cmd: "skip",
  aliases: [],
  categories: ["voiceConnection"],
  description: "skip a music",
  guildOnly: true,
  run(message) {
    const player = message.client.botGlobal.players.get(message.guild.id);
    player.skip();
  },
};
