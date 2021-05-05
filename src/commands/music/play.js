module.exports = {
  cmd: "play",
  categories: ["voiceConnection"],
  aliases: [],
  guildOnly: true,
  description: "play music",
  run(message, args) {
    const player = message.client.botGlobal.players.get(message.guild.id);
    player.play(message, args[0]);
  },
};
