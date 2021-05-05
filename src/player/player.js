const axios = require("axios");
const ytdl = require("ytdl-core");
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
    this.buffer;
    this.youtubeStream = null;
  }

  play(message, arg) {
    this.message = message;
    if (this.playing) this.message.channel.send("Added to queue");
    if (ytdl.validateURL(arg)) {
      this.queue.push({ youtube: true, arg });
    } else {
      this.message.channel.send(
        "It is not a YouTube link, it may take a little longer to load."
      );

      this.queue.push({ youtube: false, arg });
    }
    if (!this.playing) this._play(message, arg);
  }

  pause() {
    try {
      if (this.dispatcher) {
        this.dispatcher.pause();
        this.paused = true;
        this.message.channel.send("Paused.");
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
        this.message.channel.send("Resumed.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  skip() {
    try {
      if (this.playing) {
        this.dispatcher.destroy();
        if (this.streamDestroy.ytdl) this.streamDestroy.ytdl.destroy();
        if (this.streamDestroy.youtubeDlWrap)
          this.streamDestroy.youtubeDlWrap.abort();
        this.playing = false;
        this._play();
        this.message.channel.send("Skipped.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  stop() {
    try {
      if (this.playing) {
        this.dispatcher.destroy();
        if (this.youtubeStream) {
          this.buffer.destroy();
        }
        if (this.youtubeStream == false) {
          this.buffer.youtubeDlProcess.stdin.destroy();
          this.buffer.youtubeDlProcess.stdout.destroy();
          this.buffer.youtubeDlProcess.stderr.destroy();
          this.buffer.youtubeDlProcess.kill("SIGKILL");
          this.buffer.youtubeDlProcess = null;
        }
        this.buffer.destroy();
        this.buffer = null;
        this.playing = false;
        this.queue = [];
        this.message.channel.send("Stopped.");
        this.youtubeStream = null;
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

      if (this.queue[0].youtube) {
        console.log("youtube");
        this.buffer = ytdl(this.queue[0].arg, {
          filter: "audioonly",
        });
        this.youtubeStream = true;
      } else {
        this.youtubeStream = false;
        this.buffer = youtubeDlWrap
          .execStream([this.queue[0].arg, "-f", "worst[ext=mp4]"], {
            shell: true,
            detached: true,
          })
          .on("progress", (progress) => console.log(progress.totalSize))
          .on("error", () => {
            this._errorHandler();
          });
      }

      this.dispatcher = this.connection.play(this.buffer);
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
      this._errorHandler();
    }
  }

  _errorHandler() {
    this.dispatcher.destroy();
    if (this.youtubeStream) {
      this.buffer.destroy();
    }
    if (this.youtubeStream == false) {
      this.buffer.youtubeDlProcess.stdin.destroy();
      this.buffer.youtubeDlProcess.stdout.destroy();
      this.buffer.youtubeDlProcess.stderr.destroy();
      this.buffer.youtubeDlProcess.kill("SIGKILL");
      this.buffer.youtubeDlProcess = null;
    }
    this.buffer.destroy();
    this.buffer = null;
    this.playing = false;
    this.queue = [];
    this.youtubeStream = null;
    this.message.channel.send("There has been an error.❌");
  }
};
