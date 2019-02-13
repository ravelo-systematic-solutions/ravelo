const H2o2 = require('h2o2');

module.exports = async (server, settings) => {

  await server.register({
    plugin: H2o2
  });

  for ( const block of settings.serviceMapping ) {
    server.log(['info'], 'Registering service', `http://${block.host}:${block.port}`);
    server.route([
      {
        method: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        path: `/${block.gatewayPrefix}/{serviceUri*}`,
        handler: {
          proxy: {
            uri: `http://${block.host}:${block.port}/{serviceUri}`,
            passThrough: true
          }
        }
      }
    ]);
  }

};