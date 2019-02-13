const { expect } = require('code');
const Nock = require('nock');
const TestRegistrConfig = require('../../config/test');
const { suite, test, before } = exports.lab = require('lab').script();
const Ravelo = require('../../index');

suite('Gateway Controller Actions', () => {
  let Server;
  before(async () => {
    Server = await Ravelo.init({
      enableGatewayProxy: true
    });
  });

  suite('Should proxy request to service', () => {
    before( async ({ context }) => {
      context.expected_response = {
        message: 'hello world'
      };
      Nock(`${TestRegistrConfig['consumer'].internalURL}`)
        .get('/hello-world')
        .reply(200, context.expected_response);

      context.response = await Server.inject('/consumer/hello-world');
      context.payload = JSON.parse(context.response.payload || {});
    });

    test('200 status code', ({ context }) => {
      expect(context.response.statusCode).to.equal(200);
    });

    test('expects appropriate data', ({ context }) => {
      expect(context.payload).to.equal(context.expected_response);
    });
  });

});
