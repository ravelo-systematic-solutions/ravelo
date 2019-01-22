const Package = require('./package.json');
const Hapi = require('hapi');
const config = require('./libs/config');
// const About = require('./controllers/about');
// const Fs = require('fs');

const init = async () => {

  const NODE_ENV = process.env.NODE_ENV || 'production';

  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    debug: { "request": [ "error" ] }
  });

  server.app.config = {
    name: Package.name,
    version: Package.version,
    env: NODE_ENV
  };

  if (require.main === module) {
    await server.start();
    server.log([], `Server running at: ${server.info.uri}`);
  }

  return server;
};

module.exports = init();
module.exports.config = config;