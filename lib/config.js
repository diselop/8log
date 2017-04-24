const fs = require('fs');

class Config {
  constructor() {
    try {
      const file = fs.readFileSync(`${process.cwd()}/settings.json`).toString();
      this.data = JSON.parse(file);
    } catch (err) {
      global.console.error(err);
      this.data = null;
    }
  }
  get(node) {
    if (this.data) {
      return this.data[node];
    }
    return null;
  }
}

module.exports.Config = Config;
