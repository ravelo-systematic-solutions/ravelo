const Hapi = require('hapi');
const Fs = require('fs');
const config = require('./libs/config');
const Plugins = require('./plugins');
const Service = require('./controllers/service');
const Registry = require('./controllers/registry');

const init = async (options = {}) => {

  let registryConfig, serviceConfig;
  const env = config.getEnv();
  const filePath = config.getConfigPath();
  const servicePck = config.getPackageInfo();

  try {
    let registryConfig = await config.getConfig(servicePck.name);
    Fs.writeFileSync(filePath, JSON.stringify({[servicePck.name]: registryConfig}, null, 2));
  } catch(e) {
    if( !e.message.includes('ECONNREFUSED') ) {
      // eslint-disable-next-line no-console
      console.log(e.message);
    }
  }

  try {
    registryConfig = require(filePath);
  } catch(e) {
    // eslint-disable-next-line no-console
    console.log('Error: You need to configure either the config file or the registry service.');
    process.exit(1);
  }

  const settings = Object.assign({
    enableServiceController: false,
    enableRegistryController: false,
    enableGatewayProxy: false,
    enableGatewayAccess: false
  }, registryConfig[servicePck.name], options);

  if ( !(servicePck.name in registryConfig) ) {
    // eslint-disable-next-line no-console
    console.log(`the ${servicePck.name} service config block was not found.`);
    process.exit(1);
  }

  serviceConfig = registryConfig[servicePck.name];

  const server = Hapi.server({
    port: serviceConfig.service.port,
    host: serviceConfig.service.host,
    debug: serviceConfig.debug
  });

  server.app.config = {
    name: servicePck.name,
    version: servicePck.version,
    env
  };

  if(settings.enableServiceController) {
    // register ravelo controller actions
    server.route(Service);
  }

  if(settings.enableRegistryController) {
    // register ravelo controller actions
    server.route(Registry);
  }

  await Plugins(server, settings, registryConfig);

  return server;
};

module.exports.init = init;
module.exports.config = config;
