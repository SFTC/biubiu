var fileName = {};

fileName.getHeadUpper = function(name) {
  if (name) {
    return name.substring(0, 1).toUpperCase() + name.substring(1);
  }
  return '';
}

fileName.getHeadLower = function(name) {
  if (name) {
    return name.substring(0, 1).toLowerCase() + name.substring(1);
  }
  return '';
}

fileName.getFullUpper = function(name) {
  if (name) {
    return name.toUpperCase();
  }
  return '';
}

fileName.getFullLower = function(name) {
  if (name) {
    return name.toLowerCase();
  }
  return '';
}

module.exports = fileName;
