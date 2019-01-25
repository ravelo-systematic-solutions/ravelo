const Request = require('request-promise');
const config = require('../libs/config');

const service = {
  method: 'GET',
  path: '/_registry/health',
  handler: async (req) => {

    const registryService = req.server.app.config;
    const health = {
      name: registryService.name,
      version: registryService.version,
      env: registryService.env
    };
    const registryName = req.server.app.config.name;
    const filePath = config.getConfigPath();
    const registryConfig = require(filePath);

    for ( const serviceName in registryConfig ) {
      if ( serviceName !== registryName ) {
        const serviceBlock = registryConfig[serviceName];
        let response = {};
        try {
          response = await Request.get({
            uri: `${serviceBlock.internalURL}/_service`,
            resolveWithFullResponse: true
          });
          health[serviceName] = {
            status: response.statusCode,
            body: response.body
          };
        } catch (e) {
          health[serviceName] = {
            status: 404,
            description: e.message.includes('ECONNREFUSED') ? 'Service not available' : e.message
          };
        }
      }
    }

    return health;
  }
};

module.exports = [
  service
];