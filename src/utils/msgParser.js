module.exports = (msg) => {
  const prefix = process.env.PREFIX;
  if (!msg.content.startsWith(prefix) || msg.author.bot)
    return { args: null, command: null };
  const args = msg.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();
  return { args, command };
};
