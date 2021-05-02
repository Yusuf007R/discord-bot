const axios = require("axios");
// const ytdl = require("ytdl-core");
const YoutubeDlWrap = require("youtube-dl-wrap");
const youtubeDlWrap = new YoutubeDlWrap();
module.exports = class Player {
  constructor() {
    this.connection;
    this.dispatcher;
    this.queue = [];
    this.playing = false;
    this.message;
    this.paused = false;
  }

  play(message, arg) {
    this.message = message;
    this.queue.push(arg);
    if (!this.playing) this._play(message, arg);
  }

  pause() {
    try {
      if (this.dispatcher) {
        this.dispatcher.pause();
        this.paused = true;
      }
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
        this.paused = false;
      }
      console.log("resumed");
    } catch (error) {
      console.log(error);
    }
  }

  skip() {
    try {
      if (this.playing) {
        this.dispatcher.destroy();
        this.playing = false;
        this._play();
      }
    } catch (error) {
      console.log(error);
    }
  }

  stop() {
    try {
      if (this.playing) {
        this.dispatcher.destroy();
        this.playing = false;
        this.queue = [];
      }
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

  async _play() {
    if (this.queue.length == 0) return;
    try {
      this.playing = true;
      this.connection = await this.message.member.voice.channel.join();
      let buffer = youtubeDlWrap
        .execStream([this.queue[0], "-f", "best[ext=mp4]"])
        .on("progress", (progress) =>
          console.log(
            progress.percent,
            progress.totalSize,
            progress.currentSpeed,
            progress.eta
          )
        )
        .on("youtubeDlEvent", (eventType, eventData) =>
          console.log(eventType, eventData)
        )
        .on("error", (error) => console.error(error))
        .on("close", () => console.log("all done"));

      // console.log(buffer);
      this.dispatcher = this.connection.play(buffer);
      this.dispatcher.on("start", () => {
        this.queue.shift();
      });
      this.dispatcher.on("finish", () => {
        if (this.queue.length == 0) {
          this.playing = false;
        }
        this._play();
      });
    } catch (error) {
      console.log(error);
    }
  }
};
