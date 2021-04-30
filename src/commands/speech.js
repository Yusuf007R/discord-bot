const axios = require("axios");

module.exports = {
  name: "speech",
  description: "speech command!",
  async run(message, args) {
    try {
      const connection = await message.member.voice.channel.join();
      axios
        .post(
          "https://ttsmp3.com/makemp3_new.php",
          `msg=${args.join(" ")}&lang=Lupe&source=ttsmp3`
        )
        .then((res) => {
          // setInterval(() => {
          //   const dispatcher = connection.play(xd.data.URL);
          // }, 5000);
          const dispatcher = connection.play(res.data.URL);
          dispatcher.setVolume(1);
        });
    } catch (error) {
      console.log(error);
    }
  },
};
