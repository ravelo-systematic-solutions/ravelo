// const Nock = require('nock');
const { expect } = require('code');
const { suite, test, before } = exports.lab = require('lab').script();
const Ravelo = require('../../index');

suite('Gateway Controller Actions', () => {
  let Server;
  before(async () => {
    Server = await Ravelo.init({
      enableGatewayController: true,
      enableServiceController: true
    });
  });

  suite('Should be able to translate path to service', () => {
    before( async ({ context }) => {
      context.response = await Server.inject('/consumer');
      context.payload = JSON.parse(context.response.payload || {});
    });

    test('200 status code', async ({ context }) => {
      expect(context.response.statusCode).to.equal(200);
    });
  });

});
