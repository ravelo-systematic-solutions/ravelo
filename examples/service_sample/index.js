const Ravelo = require('ravelo');

const init = async () => {
  const server = await Ravelo.init();

  if (require.main === module) {
    console.log(`Ravelo Service: ${server.app.config.name}:${server.app.config.version}`);
    console.log(`Server running at: ${server.info.uri}`);
    await server.start();
  }

  return server;

};

module.exports = init();