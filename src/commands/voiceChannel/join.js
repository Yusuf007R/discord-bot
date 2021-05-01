module.exports = {
  name: "join",
  description: "join voice channel",
  run(message, args) {
    if (!message.guild.me.voice.channel) message.member.voice.channel.join();
  },
};
