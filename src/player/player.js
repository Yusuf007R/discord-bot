const axios = require("axios");
const ytdl = require("ytdl-core");
const Discord = require("discord.js");

module.exports = class Player {
  constructor() {
    this.connection, this.message;
    this.dispatcher, this.buffer;
    this.queue = [];
    this.playing = false;
    this.paused = false;
    this.youtubeStream = null;
    this.searching = false; //this property is used in the search system
  }

  async play(message, arg) {
    this.message = message;
    if (ytdl.validateURL(arg)) {
      this.queue.push({
        youtube: true,
        video_url: arg,
      });
      this.message.channel.send("Added to queue");
      if (!this.playing) return this._play();
    }
    this.message.channel.send("Not a valid Youtube link.");
  }

  pause(message) {
    try {
      if (this.dispatcher) {
        this.dispatcher.pause();
        this.paused = true;
        message.channel.send("Paused.");
      }
    } catch (error) {
      console.log(error);
      this._errorHandler();
    }
  }

  resume(message) {
    try {
      if (this.dispatcher) {
        //there is a bug with the resume on node16 this is a"quick fix/ workaround" should be delete when the bug is fixed
        this.dispatcher.resume();
        this.dispatcher.pause();
        this.dispatcher.resume();
        this.paused = false;
        message.channel.send("Resumed.");
      }
    } catch (error) {
      console.log(error);
      this._errorHandler();
    }
  }
  seek(message, args) {
    try {
      if (!this.playing) {
        return message.channel.send(
          "You have start playing a song before use this command."
        );
      }
      if (!args.length || isNaN(args[0])) {
        return message.channel.send("You have to specify a number in seconds");
      }

      this._play(args[0]);
    } catch (error) {
      console.log(error);
      this._errorHandler();
    }
  }

  skip(message) {
    try {
      if (this.playing) {
        this.dispatcher.destroy();
        if (this.youtubeStream) {
          this.buffer.destroy();
        }
        this.queue.shift();
        this.playing = false;
        this._play();
        message.channel.send("Skipped.");
      }
    } catch (error) {
      console.log(error);
      this._errorHandler();
    }
  }

  stop(message) {
    try {
      if (this.playing) {
        this.dispatcher.destroy();
        if (this.youtubeStream) {
          this.buffer.destroy();
        }
        this.buffer.destroy();
        this.buffer = null;
        this.playing = false;
        this.queue = [];
        message.channel.send("Stopped.");
        this.youtubeStream = null;
      }
    } catch (error) {
      console.log(error);
      this._errorHandler();
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
      this._errorHandler();
    }
  }

  async _play(seek = 0) {
    if (this.queue.length == 0) return;
    try {
      let embed;
      this.playing = true;
      if (!this.connection)
        this.connection = await this.message.member.voice.channel.join();
      if (this.queue[0].youtube) {
        console.log("youtube");
        this.buffer = ytdl(this.queue[0].video_url, {
          filter: "audioonly",
        });
        this.youtubeStream = true;
        this.buffer.on("info", (info) => {
          let minutes =
            Math.floor(info.videoDetails.lengthSeconds / 60) +
            ":" +
            (info.videoDetails.lengthSeconds % 60
              ? info.videoDetails.lengthSeconds % 60
              : "00");

          embed = new Discord.MessageEmbed()
            .setTitle("Now playing: ")
            .setThumbnail(
              info.videoDetails.thumbnails[
                info.videoDetails.thumbnails.length - 1
              ].url
            )
            .setDescription(
              `[${info.videoDetails.title}](${this.queue[0].video_url}/ 'optional hovertext') `
            )
            .setTimestamp()
            .setFooter(`Duration: ${minutes}`);
        });
      }
      this.buffer.on("error", (err) => {
        console.error(err);
      });
      this.dispatcher = this.connection.play(this.buffer, {
        seek,
      });
      this.dispatcher.on("start", () => {
        if (seek > 0) return;
        this.message.channel.send(embed);
      });
      this.dispatcher.on("finish", () => {
        this.queue.shift();
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
    if (this.dispatcher) this.dispatcher.destroy();
    if (this.youtubeStream) this.buffer.destroy();
    this.buffer = null;
    this.playing = false;
    this.queue = [];
    this.youtubeStream = null;
    this.message.channel.send("There has been an error.❌");
  }
};
