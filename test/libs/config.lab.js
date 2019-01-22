const { expect } = require('code');
const {  suite, test, before } = exports.lab = require('lab').script();
const Nock = require('nock');
// const libConfig = require('../conf/test');
const ravelo = require('../../index');

suite('ravelo.config', () => {
  suite('.getEnv', () => {

    test('retrieves production by default', () => {
      // overwrite NODE_ENV
      const currentEnv = process.env.NODE_ENV;
      delete process.env.NODE_ENV;

      expect(ravelo.config.getEnv()).to.equal('production');

      // put NODE_ENV back to what it was
      process.env.NODE_ENV = currentEnv;
    });

    test('retrieves value from process.env.NODE_ENV', () => {
      // overwrite NODE_ENV
      const targetEnv = 'test';
      const currentEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = targetEnv;

      expect(ravelo.config.getEnv()).to.equal(targetEnv);

      // put NODE_ENV back to what it was
      process.env.NODE_ENV = currentEnv;
    });

  });

  suite('.isEnvValid', () => {
    test('throws an exception error when invalid env is set', () => {
      // overwrite NODE_ENV
      const invalidEnv = 'invalid';
      const currentEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = invalidEnv;

      expect(() => {
        SSMSLib.config.isEnvValid();
      }).to.throw(Error);

      // put NODE_ENV back to what it was
      process.env.NODE_ENV = currentEnv;
    });
  });

  suite('.getConfig', () => {

    suite('retrieves configuration options', () => {
      before(async ({ context }) => {
        context.validEnv = 'test';
        context.invalidEnv = 'test';
        context.sampleRegistryConfig = {
          'ssms-service-a': { 'opt-b': 'val-a' },
          'ssms-service-b': { 'opt-a': 'val-a' }
        };

        Nock('http://localhost:4000')
          .get('/config/ssms-service-a')
          .reply(200, context.sampleRegistryConfig);

        context.config = await ravelo.config.getConfig(context.validEnv, 'ssms-service-a');
      });

    //   test('contains expected options', ({ context }) => {
    //     expect(context.config).to.equal(context.sampleRegistryConfig);
    //   });
    //
    //   test('returns an object', ({ context }) => {
    //     expect(typeof context.config).to.equal(typeof {});
    //   });
    });

    test('throws an error when invalid env is passed', async () => {
      const invalidEnv = 'invalid';
      try {
        await SSMSLib.config.getConfig(invalidEnv, 'some-service');
        test.fail('error should be thrown')
      } catch (e) {}

    });

    test('throws an error when API is not available', async () => {
      const invalidEnv = 'invalid';
      try {
        await SSMSLib.config.getConfig('test', 'some-service');
        test.fail('error should be thrown')
      } catch (e) {}

    });

  });
});
