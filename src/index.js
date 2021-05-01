const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const commandHandler = require("./utils/commandHandler");

let commandList = new Array();
let prefix = "!";
client.botGlobal = {};

const commandCategories = fs.readdirSync("./src/commands");

for (let i = 0; i < commandCategories.length; i++) {
  fs.readdirSync(`./src/commands/${commandCategories[i]}`)
    .filter((file) => file.endsWith(".js"))
    .map((file) => {
      const command = require(`./commands/${commandCategories[i]}/${file}`);
      commandList.push(command);
    });
}

client.on("ready", () => {
  console.log(`connected as ${client.user.tag}`);
});

client.on("message", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();
  let commandObj = commandHandler(command, commandList);
  if (commandObj) {
    commandObj.run(message, args);
  }
});

client.login(process.env.BOT_TOKEN);
