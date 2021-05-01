const axios = require("axios");

module.exports = {
  cmd: "repeat",
  description: "repeat a massage",
  async run(message, args) {
    try {
      const connection = await message.member.voice.channel.join();
      axios
        .post(
          "https://ttsmp3.com/makemp3_new.php",
          `msg=${args.join(" ")}&lang=Lupe&source=ttsmp3`
        )
        .then((res) => {
          setInterval(() => {
            connection.play(res.data.URL);
          }, 5000);
        });
    } catch (error) {
      console.log(error);
    }
  },
};
