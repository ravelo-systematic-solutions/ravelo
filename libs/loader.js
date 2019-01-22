const Fs = require('fs');

let rootDir = null;

/**
 * Define application's root directory.
 *
 * This will allow us to know where to find
 * components within the application.
 *
 * @param dir
 * @throws Error if directory doesn't exist
 */
const setRootDir = module.exports = (dir) => {
  if ( ! Fs.existsSync(dir) ) {
    throw Error(`Base Dir does not exist (${dir})`);
  }

  rootDir = dir;
};