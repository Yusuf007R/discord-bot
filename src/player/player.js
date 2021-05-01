const axios = require("axios");
const ytdl = require("ytdl-core");

module.exports = class Player {
  constructor() {
    this.connection;
    this.dispatcher;
    this.queue;
  }

  async play(message, arg) {
    try {
      this.connection = await message.member.voice.channel.join();
      let buffer = ytdl(arg, {
        filter: "audioonly",
      });

      this.dispatcher = this.connection.play(buffer);
    } catch (error) {
      console.log(error);
    }
  }

  pause() {
    try {
      if (this.dispatcher) this.dispatcher.pause();
    } catch (error) {
      console.log(error);
    }
  }

  resume() {
    try {
      if (this.dispatcher) {
        //there is a bug with the resume on node16 this is a"quick fix/ workaround" should be delete when the bug is fixed
        this.dispatcher.resume();
        this.dispatcher.pause();
        this.dispatcher.resume();
      }
      console.log("resumed");
    } catch (error) {
      console.log(error);
    }
  }

  stop() {
    try {
      if (this.dispatcher) this.dispatcher.destroy();
    } catch (error) {
      console.log(error);
    }
  }

  async speech(message, arg) {
    try {
      this.connection = await message.member.voice.channel.join();
      let res = await axios.post(
        "https://ttsmp3.com/makemp3_new.php",
        `msg=${arg}&lang=Lupe&source=ttsmp3`
      );
      this.dispatcher = this.connection.play(res.data.URL);
    } catch (error) {
      console.log(error);
    }
  }
};
