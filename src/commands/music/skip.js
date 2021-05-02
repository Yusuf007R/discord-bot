module.exports = {
  cmd: "skip",
  aliases: [],
  description: "skip a music",
  run(message, args) {
    const player = message.client.botGlobal.players.get(
      message.client.guilds.id
    );
    player.skip();
    message.channel.send("Skipped.");
  },
};
