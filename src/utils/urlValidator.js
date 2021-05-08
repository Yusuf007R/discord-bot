module.exports = (arg) => {
  try {
    new URL(arg);
  } catch (_) {
    return false;
  }
  return true;
};
