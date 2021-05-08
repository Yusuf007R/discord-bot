module.exports = {
  cmd: "stop",
  aliases: [],
  categories: ["voiceConnection"],
  description: "stop the music/speech",
  guildOnly: true,
  run(message) {
    const player = message.client.botGlobal.players.get(message.guild.id);
    player.stop(message);
  },
};
