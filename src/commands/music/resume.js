module.exports = {
  cmd: "resume",
  aliases: [],
  categories: ["voiceConnection"],
  description: "resume music/speech",
  guildOnly: true,
  run(message) {
    const player = message.client.botGlobal.players.get(message.guild.id);
    player.resume(message);
  },
};
