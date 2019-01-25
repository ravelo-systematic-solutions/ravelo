const about = {
  method: 'GET',
  path: '/_service',
  handler: (req) => {
    const {
      name,
      version,
      env
    } = req.server.app.config;
    return {
      name,
      version,
      env
    };
  }
};

module.exports = [
  about
];