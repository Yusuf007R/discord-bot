module.exports = (commandWord, commandList) => {
  return commandList.find(
    (command) =>
      command.cmd == commandWord ||
      (command.aliases && command.aliases.find((alias) => alias == commandWord))
  );
};
