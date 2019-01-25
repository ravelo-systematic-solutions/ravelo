const HttpError = require('../../errors/http-error');
const { expect } = require('code');
const TestRegistrConfig = require('../../config/test');
const {  suite, test, before } = exports.lab = require('lab').script();
const Ravelo = require('../../index');
const Package = require('../../package');

suite('HttpError', () => {

  test('stores 2 parameters', async () => {
    const message = 'something went wrong';
    const statusCode = 200;

    const error = new HttpError(message, statusCode);

    expect(error.message).to.equal(message);
    expect(error.statusCode).to.equal(statusCode);
  });

  test('uses 500 status code by default', async () => {
    const message = 'something went wrong again';

    const error = new HttpError(message);

    expect(error.message).to.equal(message);
  });

});
