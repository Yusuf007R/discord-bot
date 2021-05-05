const Discord = require("discord.js");
module.exports = {
  cmd: "avatar",
  aliases: ["av"],
  categories: ["chat"],
  guildOnly: false,
  description: "get user avatar",
  run(message) {
    const user = message.mentions.users.first() || message.author;
    const av = user.avatarURL({ size: 4096 });
    const tag = user.tag;
    const embed = new Discord.MessageEmbed().setAuthor(tag, av).setImage(av);
    message.channel.send(embed);
  },
};
