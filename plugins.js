const Good = require('good');
const H2o2 = require('h2o2');

module.exports = async (server, settings) => {

  server.log(['info'], 'Loading good config');
  await server.register({
    plugin: Good,
    options: {
      ops: {
        interval: 1000
      },
      reporters: {
        consoleReporter: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{
            log: '*',
            response: '*'
          }]
        }, {
          module: 'good-console'
        }, 'stdout']
      }
    }
  });

  if (settings.enableGatewayProxy) {
    await server.register({
      plugin: H2o2
    });

    for ( const block in settings ) {
      if (block.enableGatewayAccess) {
        const gatewayUrlPrefix = block.gatewayUrlPrefix;
        const protocol = block.intenalURL.split('://')[0];
        const port = block.service.port;
        const host = block.service.host;
        server.route([
          {
            method: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            path: `${gatewayUrlPrefix}/*`,
            handler: {
              proxy: {
                host: host,
                port: port,
                protocol: protocol,
                passThrough: true,
                xforward: true
              }
            }
          }
        ]);
      }
    }
  }
};