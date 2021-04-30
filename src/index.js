const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");

let commands = new Map();
let prefix = "!";

const commandFiles = fs
  .readdirSync("./src/commands")
  .filter((file) => file.endsWith(".js"));

for (let i = 0; i < commandFiles.length; i++) {
  const command = require(`./commands/${commandFiles[i]}`);
  commands.set(command.name, command);
}

client.on("ready", () => {
  console.log(`connected as ${client.user.tag}`);
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();

  let commandObj = commands.get(command);
  if (commandObj) {
    commandObj.run(message, args);
  }
});

client.login(process.env.BOT_TOKEN);
