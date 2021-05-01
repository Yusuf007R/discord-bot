const axios = require("axios");

module.exports = {
  cmd: "speech",
  aliases: ["s"],
  description: "speech command!",
  async run(message, args) {
    // message.client.botGlobal.player.speech(message, args.join(" "));
    const player = message.client.botGlobal.players.get(
      message.client.guilds.id
    );
    player.speech(message, args.join(" "));

    // try {
    //   message.client.botGlobal.connection = await message.member.voice.channel.join();
    //   let res = await axios.post(
    //     "https://ttsmp3.com/makemp3_new.php",
    //     `msg=${args.join(" ")}&lang=Lupe&source=ttsmp3`
    //   );
    //   message.client.botGlobal.dispatcher = message.client.botGlobal.connection.play(
    //     res.data.URL
    //   );
    // } catch (error) {
    //   console.log(error);
    // }
  },
};
