module.exports = {
  cmd: "join",
  description: "join voice channel",
  run(message) {
    try {
      if (!message.guild.me.voice.channel) message.member.voice.channel.join();
    } catch (error) {
      console.log(error);
    }
  },
};
