module.exports = {
  cmd: "loop",
  guildOnly: true,
  aliases: [],
  categories: ["voiceChannel"],
  description: "loop single, all or off",
  run(message, args) {
    const player = message.client.botGlobal.players.get(message.guild.id);
    if (!args.length)
      return message.channel.send('Use "single", "all" or "off".');
    switch (args[0]) {
      case "all":
        player.loop = "all";
        message.channel.send("Looping all");
        break;
      case "single":
        player.loop = "single";
        message.channel.send("Looping single");
        break;
      case "off":
        player.loop = null;
        message.channel.send("Looping off");
        break;
      default:
        message.channel.send('Invalid argument, use "single", "all" or "off".');
        break;
    }
  },
};
