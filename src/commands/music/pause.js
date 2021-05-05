module.exports = {
  cmd: "pause",
  categories: ["voiceConnection"],
  aliases: [],
  guildOnly: true,
  description: "pause current music/speech",
  run(message) {
    const player = message.client.botGlobal.players.get(message.guild.id);
    player.pause();
  },
};
