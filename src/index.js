const Discord = require("discord.js");
const fs = require("fs");
const Player = require("./player/player");
const commandHandler = require("./utils/commandHandler");
const msgParser = require("./utils/msgParser");

const client = new Discord.Client();
client.login(process.env.BOT_TOKEN);

let commandList = new Array();
client.botGlobal = {};
client.botGlobal.players = new Discord.Collection();

const commandFiles = fs.readdirSync("./src/commands");

commandFiles.map((folder) => {
  fs.readdirSync(`./src/commands/${folder}`)
    .filter((file) => file.endsWith(".js"))
    .map((file) => {
      const command = require(`./commands/${folder}/${file}`);
      commandList.push(command);
    });
});

client.on("ready", () => {
  console.log(`connected as ${client.user.tag}`);
  client.guilds.cache.map((guild) =>
    client.botGlobal.players.set(guild.id, new Player())
  );
});

client.on("message", async (message) => {
  if (message.author.bot) return;
  const { args, command } = msgParser(message);
  if (!command) return;
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
