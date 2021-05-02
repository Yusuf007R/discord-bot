module.exports = {
  cmd: "join",
  description: "join voice channel",
  run(message, args) {
    try {
      if (!message.guild.me.voice.channel) message.member.voice.channel.join();
    } catch (error) {
      console.log(error);
    }
  },
};
