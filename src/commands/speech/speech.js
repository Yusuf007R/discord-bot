module.exports = {
  cmd: "speech",
  aliases: ["s"],
  categories: ["voiceConnection"],
  description: "speech command!",
  guildOnly: true,
  async run(message, args) {
    const player = message.client.botGlobal.players.get(message.guild.id);
    player.speech(message, args.join(" "));
  },
};
