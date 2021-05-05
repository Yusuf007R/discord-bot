module.exports = {
  cmd: "join",
  categories: ["voiceConnection"],
  description: "join voice channel",
  guildOnly: true,
  run(message) {
    try {
      if (!message.guild.me.voice.channel) message.member.voice.channel.join();
    } catch (error) {
      console.log(error);
    }
  },
};
