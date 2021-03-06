const Ravelo = require('ravelo');

const init = async () => {
  const server = await Ravelo.init();

  server.route({
    method: 'GET',
    path: '/hello-world',
    handler: async () => {
      return {
        message: 'Hello World'
      };
    }
  });

  if (require.main === module) {
    server.log(['info'], 'Ravelo Service', `${server.app.config.name}:${server.app.config.version}`);
    server.log(['info'], 'Server running', `${server.info.uri}`);
    await server.start();
  }

  return server;
};

module.exports = init();