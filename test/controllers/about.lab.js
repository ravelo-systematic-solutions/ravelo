const { expect } = require('code');
const {  suite, test, before } = exports.lab = require('lab').script();
const Ravelo = require('../../index');
const Package = require('../../package');

suite('About Controller Actions', () => {
  let Server;
  before(async () => {
    Server = await Ravelo.init();
  });
  suite('/ GET returns', () => {
    before( async ({ context }) => {
      context.response = await Server.inject('/');
      context.payload = JSON.parse(context.response.payload || {});
    });

    test('200 status code', async ({ context }) => {
      expect(context.response.statusCode).to.equal(200);
    });

    test('package name', async ({ context }) => {
      expect(context.payload.name).to.equal(Package.name);
    });

    test('package version', async ({ context }) => {
      expect(context.payload.version).to.equal(Package.version);
    });

    test('environment', async ({ context }) => {
      expect(context.payload.env).to.equal(process.env.NODE_ENV);
    });

  });
});
