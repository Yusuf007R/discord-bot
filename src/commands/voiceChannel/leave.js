module.exports = {
  cmd: "leave",
  categories: ["chat"],
  guildOnly: true,
  description: "leave voice channel ",
  run(message) {
    try {
      const player = message.client.botGlobal.players.get(message.guild.id);
      if (message.guild.me.voice.channel) player.stop(message);
      message.guild.me.voice.channel.leave();
    } catch (error) {
      console.log(error);
    }
  },
};
