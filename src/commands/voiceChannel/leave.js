module.exports = {
  name: "leave",
  description: "leave voice channel ",
  run(message, args) {
    if (message.guild.me.voice.channel) message.guild.me.voice.channel.leave();
  },
};
