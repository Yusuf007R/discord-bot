module.exports = {
  cmd: "stop",
  aliases: [],
  description: "stop the music/speech",
  run(message, args) {
    try {
      if (message.client.botGlobal.dispatcher)
        message.client.botGlobal.dispatcher.destroy();
    } catch (error) {
      console.log(error);
    }
  },
};
