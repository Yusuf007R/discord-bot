const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const Player = require("./player/player");
const commandHandler = require("./utils/commandHandler");

const prefix = process.env.PREFIX;
let commandList = new Array();
client.botGlobal = {};
client.botGlobal.players = new Discord.Collection();

const commandFiles = fs.readdirSync("./src/commands");

for (let i = 0; i < commandFiles.length; i++) {
  fs.readdirSync(`./src/commands/${commandFiles[i]}`)
    .filter((file) => file.endsWith(".js"))
    .map((file) => {
      const command = require(`./commands/${commandFiles[i]}/${file}`);
      commandList.push(command);
    });
}

client.on("ready", () => {
  console.log(`connected as ${client.user.tag}`);
  client.guilds.cache.map((guild) =>
    client.botGlobal.players.set(guild.id, new Player())
  );
});

client.on("message", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();
  let commandObj = commandHandler(command, commandList);
  if (commandObj) {
    if (message.channel.type === "dm" && commandObj.guildOnly) {
      message.channel.send(
        "You can't use this command from private message, Because it is a guild only command."
      );
      return;
    }
    if (message.channel.type !== "dm") {
      if (
        !message.member.voice.channel &&
        commandObj.categories.find((category) => category == "voiceConnection")
      ) {
        message.channel.send(
          "You have to be connected to a voice channel to use this command."
        );
        return;
      }
    }
    commandObj.run(message, args);
  }
});

client.login(process.env.BOT_TOKEN);
