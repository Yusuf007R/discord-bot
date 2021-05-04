module.exports = {
  cmd: "leave",
  description: "leave voice channel ",
  run(message) {
    try {
      const player = message.client.botGlobal.players.get(message.guild.id);
      if (message.guild.me.voice.channel) player.stop();
      message.guild.me.voice.channel.leave();
    } catch (error) {
      console.log(error);
    }
  },
};
