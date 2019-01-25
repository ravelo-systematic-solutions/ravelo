const { expect } = require('code');
const {  suite, test, before } = exports.lab = require('lab').script();
const Nock = require('nock');
const Path = require('path');
const ravelo = require('../../index');
const Package = require('../../package');

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

  suite('.getRegistryUrl', () => {

    test('retrieves http://localhost:3000 by default', () => {
      // overwrite NODE_ENV
      const currentRegistry = process.env.REGISTRY_URL;
      delete process.env.REGISTRY_URL;

      expect(ravelo.config.getRegistryUrl()).to.equal(
        'http://localhost:3000'
      );

      // put NODE_ENV back to what it was
      process.env.REGISTRY_URL = currentRegistry;
    });

    test('retrieves value from process.env.REGISTRY_URL', () => {
      // overwrite NODE_ENV
      const targetRegistry = 'http://localhost:5000';
      const currentRegistry = process.env.REGISTRY_URL;
      process.env.REGISTRY_URL = targetRegistry;

      expect(ravelo.config.getRegistryUrl()).to.equal(targetRegistry);

      // put NODE_ENV back to what it was
      process.env.REGISTRY_URL = currentRegistry;
    });

  });

  suite('.isEnvValid', () => {
    test('throws an exception error when invalid env is set', () => {
      expect(() => {
        ravelo.config.isEnvValid('invalid-env');
      }).to.throw(Error);
    });
  });

  suite('.getRootDir', () => {
    test('uses the application root by default', () => {
      const root = Path.resolve(`${__dirname}/../..`);
      expect(ravelo.config.getRootDir()).to.equal(root);
    });

    test('can be changed', () => {
      const currentRootDir = ravelo.config.getRootDir();
      const dir = __dirname;
      ravelo.config.setRootDir(dir);
      expect(ravelo.config.getRootDir()).to.equal(dir);
      ravelo.config.setRootDir(currentRootDir);
    });

  });

  suite('.getConfigPath', () => {
    test('retrieves the expected path', () => {
      const root = Path.resolve(`${__dirname}/../..`);
      expect(ravelo.config.getConfigPath()).to.equal(`${root}/config/test.json`);
    });
  });

  suite('.getConfig', () => {

    suite('retrieves configuration options', () => {
      before(async ({ context }) => {
        const url = ravelo.config.getRegistryUrl();
        context.validEnv = 'test';
        context.invalidEnv = 'test';
        context.sampleRegistryConfig = {
          'ssms-service-a': { 'opt-b': 'val-a' },
          'ssms-service-b': { 'opt-a': 'val-a' }
        };

        Nock(url)
          .get('/config/ssms-service-a')
          .reply(200, context.sampleRegistryConfig);

        context.config = await ravelo.config.getConfig(context.validEnv, 'ssms-service-a');
      });

      test('contains expected options', ({ context }) => {
        expect(context.config).to.equal(context.sampleRegistryConfig);
      });
    });

    test('throws an error when API is not available', async () => {
      try {
        await ravelo.config.getConfig('test', 'some-service');
        test.fail('error should be thrown');
      } catch (e) {}

    });

  });

  suite('.getPackageInfo', () => {

    test('retrieves the package that belongs to the service', () => {
      expect(ravelo.config.getPackageInfo()).to.equal(Package);
    });

  });
});
