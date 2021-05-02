module.exports = {
  cmd: "leave",
  description: "leave voice channel ",
  run(message, args) {
    try {
      if (message.guild.me.voice.channel)
        message.guild.me.voice.channel.leave();
    } catch (error) {
      console.log(error);
    }
  },
};
