const Ravelo = require('ravelo');

const init = async () => {
  const server = await Ravelo.init();

  if (require.main === module) {
    server.log(['info'], 'Ravelo Service', `${server.app.config.name}:${server.app.config.version}`);
    server.log(['info'], 'Server running', `${server.info.uri}`);
    await server.start();
  }

  return server;
};

module.exports = init();