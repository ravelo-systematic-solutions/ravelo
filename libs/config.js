const Fs = require('fs');
const Request = require('request-promise');
const VALID_ENVS = ['production', 'development', 'local', 'test'];
const DEFAULT_ENV = 'production';
const DEFAULT_REGISTRY_URL = 'http://localhost:3000';
let ROOT_DIR = null;

/**
 * Gets the registry service url
 *
 * This url is used to figure out what the configuration
 * of each service is.
 *
 * @return String url that points to the registry service
 */
const getRegistryUrl = () => {
  const url = process.env.REGISTRY_URL || null;
  if(url === null || url === 'undefined' || !url) {
    return DEFAULT_REGISTRY_URL;
  }

  return url;
};

/**
 * Check if environment is valid or not
 *
 * @param environment
 * @throws Error if environment is invalid
 * @returns {boolean} true if environment is valid
 */
const isEnvValid = (environment) => {
  if (VALID_ENVS.indexOf(environment) === -1) {
    throw Error(`Invalid environment: ${environment} (${VALID_ENVS.join(', ')})`);
  }
  return true;
};

/**
 * Retrieves the NODE_ENV environment variable
 *
 * Production is the default environment.
 *
 * @returns {String} name of environment
 */
const getEnv = module.exports.getEnv = () => {
  const environment = process.env.NODE_ENV;

  if(environment === null || environment === 'undefined' || !environment) {
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
  const url = getRegistryUrl();

  config = await Request.get(`${url}/config/${serviceName}`);
  return JSON.parse(config);
};

/**
 * Define application's root directory.
 *
 * This help us calculate the position
 * of components
 *
 * @param dir
 * @throws Error if directory doesn't exist
 */
const setRootDir = (dir) => {
  if ( ! Fs.existsSync(dir) ) {
    throw Error(`Base Dir does not exist (${dir})`);
  }

  ROOT_DIR = dir;
};

/**
 * Get application's root directory
 *
 * This help us calculate the position
 * of components
 *
 * @return String
 */
const getRootDir = () => {

  if(ROOT_DIR === null || ROOT_DIR === 'undefined' || !ROOT_DIR) {
    ROOT_DIR = process.cwd();
  }

  return ROOT_DIR;
};

/**
 * Find the service package.
 *
 * This is important so we can pull information about each package
 * in the ecosystem.
 *
 * @return Object found in the service's package.json
 */
const getPackageInfo = () => {
  if ( ! Fs.existsSync(`${getRootDir()}/package.json`) ) {
    throw Error(`package.json does not exist (${getRootDir()}/package.json)`);
  }

  return require(`${getRootDir()}/package.json`);
};

/**
 * Returns the absolute path where to store the configuration files
 *
 * @return {string}
 */
const getConfigPath = () => {
  return `${getRootDir()}/config/${getEnv()}.json`;
};

module.exports = {
  getEnv,
  isEnvValid,
  getConfig,
  getRootDir,
  setRootDir,
  getConfigPath,
  getPackageInfo,
  getRegistryUrl
};