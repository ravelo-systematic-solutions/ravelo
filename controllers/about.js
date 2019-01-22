const about = {
  method: 'GET',
  path: '/',
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