const Request = require('request-promise');
const config = require('../libs/config');
const HttpError = require('../errors/http-error');

const getServiceResponse = async (serviceBlock) => {

  let response;
  try {
    response = await Request.get({
      uri: `${serviceBlock.internalURL}/_service`,
      resolveWithFullResponse: true
    });
  } catch (e) {
    if( e.response === undefined ) {
      throw new HttpError('Service not available', 503);
    } else {
      const body = JSON.parse(e.response.body);
      throw new HttpError(body.description, e.response.statusCode);
    }
  }

  const body = JSON.parse(response.body);

  return {
    statusCode: response.statusCode,
    ...body
  };
};

/**
 * Get health dictionary initialized
 *
 * We're going to start by initializing
 * the health check assuming that the
 * registry is available. So we just
 * load the information pertinent to
 * registry service.
 *
 * @param req
 * @return {{}}
 */
const initHealth = (req) => {
  const registryService = req.server.app.config;
  return {
    [registryService.name]: {
      statusCode: 200,
      version: registryService.version,
      env: registryService.env
    }
  };
};

const service = {
  method: 'GET',
  path: '/_registry/health',
  handler: async (req) => {

    const health = initHealth(req);
    const registryName = req.server.app.config.name;
    const filePath = config.getConfigPath();
    const registryConfig = require(filePath);

    for ( const serviceName in registryConfig ) {
      if ( serviceName !== registryName ) {
        try {
          health[serviceName] = await getServiceResponse(registryConfig[serviceName]);
        } catch (e) {
          health[serviceName] = {
            statusCode: e.statusCode,
            description: e.message
          };
        }
      }
    }

    return health;
  }
};

const serviceConfig = {
  method: 'GET',
  path: '/_registry/{serviceName}/block',
  handler: async (req, h) => {

    const serviceName = req.params.serviceName;
    const registryConfig = require(config.getConfigPath());

    if ( !(serviceName in registryConfig) ) {
      return h.response({
        description: 'Invalid Request'
      }).code(400);
    }

    return registryConfig[serviceName];
  }
};

module.exports = [
  service,
  serviceConfig
];