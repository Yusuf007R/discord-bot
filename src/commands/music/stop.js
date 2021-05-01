module.exports = {
  cmd: "stop",
  aliases: [],
  description: "stop the music/speech",
  run(message, args) {
    // message.client.botGlobal.player.stop();

    const player = message.client.botGlobal.players.get(
      message.client.guilds.id
    );
    player.stop();
    message.channel.send("Stopped.");
    // try {
    //   if (message.client.botGlobal.dispatcher)
    //     message.client.botGlobal.dispatcher.destroy();
    // } catch (error) {
    //   console.log(error);
    // }
  },
};
