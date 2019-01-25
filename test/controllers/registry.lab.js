const Nock = require('nock');
const { expect } = require('code');
const TestRegistrConfig = require('../../config/test');
const {  suite, test, before } = exports.lab = require('lab').script();
const Ravelo = require('../../index');
const Package = require('../../package');

suite('Registry Controller Actions', () => {
  let Server;
  before(async () => {
    Server = await Ravelo.init({
      enableRegistryController: true
    });
  });
  suite('GET /_registry/health returns', () => {
    before( async ({ context }) => {

      for ( const serviceName in TestRegistrConfig ) {
        if (Package.name !== serviceName ) {
          Nock(TestRegistrConfig[serviceName].internalURL)
            .get('/_service')
            .reply(200, {
              name: serviceName,
              version: 'x.x.x',
              env: 'test'
            });
        }
      }

      context.response = await Server.inject('/_registry/health');
      context.payload = JSON.parse(context.response.payload || {});
    });

    test.only('200 status code', async ({ context }) => {
      expect(context.response.statusCode).to.equal(200);
    });

    // test('returns the health of each service', async ({ context }) => {
    //   // expect(context.response.statusCode).to.equal(200);
    // });
  });
});
