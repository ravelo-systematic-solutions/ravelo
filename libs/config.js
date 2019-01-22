// const Request = require('request-promise');
const DEFAULT_ENV = 'production';
const VALID_ENVS = ['production', 'development', 'local'];

/**
 * Check if environment is valid or not
 *
 * @param environment
 * @throws Error if environment is invalid
 * @returns {boolean} true if environment is valid
 */
const isEnvValid = (environment) => {
  if (VALID_ENVS.indexOf(environment) !== -1) {
    throw Error(`Invalid environment: ${environment} (${VALID_ENVS.join(', ')})`);
  }
  return true;
};

/**
 * Retrieves the NODE_ENV environment variable
 *
 * @returns {String} name of environment
 */
const getEnv = module.exports.getEnv = () => {
  const environment = process.env.NODE_ENV;

  if(environment === null || environment === undefined || !Boolean(environment)) {
    return DEFAULT_ENV;
  }

  return environment;
};

/**
 * Hits aregistry for collecting environment configuration
 * options
 *
 * @throws Error if environment is not valid
 * @param environment {String} valid environment
 * @param serviceName {String} name of service set in package.json
 * @returns {Object} Registry Configuration
 */
const getConfig = async (environment, serviceName) => {

  let config = {};

  if( ! isEnvValid(environment) ) {
    throw Error(`Invalid environment: ${environment}`);
  }

  const libConfig = require(`../conf/${environment}`);

  config = await Request.get(libConfig.registry.replace(/\{serviceName\}/g, serviceName));
  return JSON.parse(config);
};

module.exports = {
  getEnv,
  isEnvValid,
  getConfig
};