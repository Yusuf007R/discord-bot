const ytsr = require("ytsr");
const urlValidator = require("../../utils/urlValidator");
const msgParser = require("../../utils/msgParser");
const Discord = require("discord.js");
let emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];

module.exports = {
  cmd: "play",
  categories: ["voiceConnection"],
  aliases: ["p"],
  guildOnly: true,
  description: "play music",
  async run(message, args) {
    const player = message.client.botGlobal.players.get(message.guild.id);
    if (urlValidator(args[0])) {
      message.suppressEmbeds(true);
      return player.play(message, args[0]);
    }
    if (player.searching) {
      player.searchCancel();
    }

    if (!args.length)
      return message.channel.send(
        "Argument is needed, either a song name or URL."
      );
    let embed = new Discord.MessageEmbed();
    let prefix = process.env.PREFIX;
    embed
      .setTitle("Song selection")
      .setDescription(
        `You can react to the emojis or use ${prefix}play 1-5 to select a song`
      );
    let items;
    try {
      const searchResults = await ytsr(args.join(" "), { limit: 5 });
      items = searchResults.items;
      player.searching = true;
    } catch (error) {
      console.log(error);
    }
    for (let i = 0; i < items.length; i++) {
      embed.addField(`\u200B`, `${emojis[i]}: ${items[i].title}`);
    }
    message.channel.send(embed).then(async (msgObj) => {
      try {
        const options = {
          time: 60000,
          max: 1,
        };
        //emoji collector
        const emojiFilter = (reaction, user) => {
          return (
            emojis.includes(reaction.emoji.name) &&
            user.id === message.author.id
          );
        };
        const emojiColector = msgObj.createReactionCollector(
          emojiFilter,
          options
        );
        //emoji collector events

        emojiColector.on("collect", (reaction) => {
          try {
            let index = emojis.findIndex(
              (emoji) => emoji == reaction.emoji.name
            );
            let data = items[index];
            if (!msgObj.deleted) {
              msgObj.delete();
            }
            player.play(message, data.url);
          } catch (error) {
            console.log(error);
          }
        });
        emojiColector.on("end", (collected, reason) => {
          if (reason == "ended") return;
          console.log(`Collected ${collected.size} items`);
          player.searching = false;
          msgCollector.stop(["ended"]);
        });
        const msgFilter = (msg) => {
          const { command, args } = msgParser(msg);
          if (!args || isNaN(args[0]) || command !== "play") return false;
          if (args[0] > 5) {
            message.channel.send("There are only 5 options");
            return false;
          }
          return true;
        };
        const msgCollector = message.channel.createMessageCollector(msgFilter, {
          time: 60000,
          max: 1,
        });
        msgCollector.on("collect", (msg) => {
          try {
            const { args } = msgParser(msg);
            let data = items[args[0] - 1];
            if (!msgObj.deleted) {
              msgObj.delete();
            }
            player.play(message, data.url);
            console.log(`Collected ${msg.content}`);
          } catch (error) {
            console.log(error);
          }
        });
        msgCollector.on("end", (collected, reason) => {
          if (reason == "ended") return;
          console.log(`Collected ${collected.size} items`);
          player.searching = false;
          emojiColector.stop(["ended"]);
        });

        const searchCancel = () => {
          emojiColector.stop(["stop"]);
          msgCollector.stop(["ended"]);
          if (!msgObj.deleted) {
            msgObj.delete();
          }
        };
        player.searchCancel = searchCancel;

        emojis.forEach(async (elem) => {
          try {
            await msgObj.react(elem);
          } catch (error) {
            //i have no idea what to do here, dont know how to cancel this loop when the msg is being delete
          }
        });
      } catch (error) {
        console.log(error);
      }
    });
  },
};
