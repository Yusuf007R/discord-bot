module.exports = {
  cmd: "play",
  aliases: [],
  description: "play music",
  run(message, args) {
    const player = message.client.botGlobal.players.get(
      message.client.guilds.id
    );
    player.play(message, args[0]);
  },
};
