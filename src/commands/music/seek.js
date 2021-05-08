module.exports = {
  cmd: "seek",
  guildOnly: true,
  aliases: [],
  categories: ["voiceConnection"],
  description: "play a song from a specified time in seconds",
  run(message, args) {
    const player = message.client.botGlobal.players.get(message.guild.id);
    player.seek(message, args);
  },
};
