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
  suite('GET /_registry/health upon successful request', () => {
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

    test('returns 200 status code', async ({ context }) => {
      expect(context.response.statusCode).to.equal(200);
    });

    test('returns the health of each service', async ({ context }) => {
      for ( const serviceName in TestRegistrConfig ) {
        expect(context.payload[serviceName].statusCode).to.equal(200);
      }
    });
  });

  test('does not break if a service is not running as expected', async () => {
    const response = await Server.inject('/_registry/health');
    const body = JSON.parse(response.payload || {});
    expect(response.statusCode).to.equal(200);
    expect(body['service-a'].statusCode).to.equal(503);
  });

  test('shows an error message if an application crashes', async () => {
    const msg = 'something went wrong';
    Nock(TestRegistrConfig['service-a'].internalURL)
      .get('/_service')
      .reply(500, {
        description: msg
      });
    const response = await Server.inject('/_registry/health');
    const body = JSON.parse(response.payload || {});
    expect(response.statusCode).to.equal(200);
    expect(body['service-a'].statusCode).to.equal(500);
    expect(body['service-a'].description).to.equal(msg);
  });

});
