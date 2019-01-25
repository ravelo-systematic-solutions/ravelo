const Package = require('./package.json');
const Hapi = require('hapi');
const config = require('./libs/config');
const Plugins = require('./plugins');
const About = require('./controllers/about');

const init = async (options = {}) => {

  const settings = Object.assign({
    enableServiceControllers: true
  }, options);

  let registryConfig, serviceConfig;
  const env = config.getEnv();
  const filePath = config.getConfigPath();
  const servicePck = config.getPackageInfo();

  try {
    let registryConfig = await config.getConfig(Package.name);
    Fs.writeFileSync(filePath, JSON.stringify(registryConfig, null, 2));
  } catch(e) {
    if( !e.message.includes('ECONNREFUSED') ) {
      // eslint-disable-next-line no-console
      console.log(e.message);
    }
  }

  try {
    registryConfig = require(filePath);
    serviceConfig = registryConfig[servicePck.name]
  } catch(e) {
    // eslint-disable-next-line no-console
    console.log('Error: You need to configure either the config file or the registry service.');
    process.exit(1);
  }

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

  if(settings.enableServiceControllers) {
    // register ravelo controller actions
    server.route(About);
  }

  await Plugins(server);

  if (require.main === module) {
    await server.start();
    server.log([], `Server running at: ${server.info.uri}`);
  }

  return server;
};

module.exports.init = init;
module.exports.config = config;
