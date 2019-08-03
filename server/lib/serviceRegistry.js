const semver = require("semver");

class ServiceRegisty {
  constructor(log) {
    this.log = log;
    this.services = {};
    this.timeout = 30;
  }

  register = (name, version, ip, port) => {
    const key = `${name}${version}${ip}${port}`;
    if (!this.services[key]) {
      //NEW SERVICE
      this.services[key] = {};
      this.services[key].ip = ip;
      this.services[key].name = name;
      this.services[key].version = version;
      this.services[key].port = port;
      this.services[key].timestamp = Math.floor(new Date() / 1000); //UNIX timestamp in seconds
      this.log.debug(
        `Added service ${name} version ${version} at ${ip}:${port} `
      );
    } else {
      //EXISTING SERVICE
      this.services[key].timestamp = Math.floor(new Date() / 1000); //UNIX timestamp in seconds
      this.log.debug(
        `Updated service ${name} version ${version} at ${ip}:${port}`
      );
    }

    return key;
  };

  unregister = (name, version, ip, port) => {
    const key = `${name}${version}${ip}${port}`;
    delete this.services[key];
    return key;
  };

  query = (name, version) => {
    const candidates = Object.values(this.services).filter(
      service =>
        service.name === name && semver.satisfies(service.version, version)
    );
    //LOAD BALANCING
    return candidates[Math.floor(Math.random() * candidates.length)];
  };
}

module.exports = ServiceRegisty;
