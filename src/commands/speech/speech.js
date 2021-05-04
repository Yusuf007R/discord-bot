module.exports = {
  cmd: "speech",
  aliases: ["s"],
  description: "speech command!",
  async run(message, args) {
    const player = message.client.botGlobal.players.get(message.guild.id);
    player.speech(message, args.join(" "));
  },
};
