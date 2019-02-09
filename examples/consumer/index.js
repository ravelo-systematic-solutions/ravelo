const Ravelo = require('ravelo');

const init = async () => {
  const server = await Ravelo.init();

  if (require.main === module) {
    server.log(`Ravelo Service: ${server.app.config.name}:${server.app.config.version}`);
    server.log(`Server running at: ${server.info.uri}`);
    await server.start();
  }

  return server;
};

module.exports = init();