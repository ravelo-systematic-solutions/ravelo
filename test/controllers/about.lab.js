// const { expect } = require('code');
// const {  suite, test, before } = exports.lab = require('lab').script();
// const Server = require('../../index');
// const Package = require('../../package');
//
// suite('About Controller Actions', () => {
//   suite('/ GET returns', () => {
//
//     before( async ({ context }) => {
//       const srv = await Server;
//       context.response = await srv.inject('/');
//       context.payload = JSON.parse(context.response.payload || {});
//     });
//
//     test('200 status code', async ({ context }) => {
//       expect(context.response.statusCode).to.equal(200);
//     });
//
//     test('package name', async ({ context }) => {
//       expect(context.payload.name).to.equal(Package.name);
//     });
//
//     test('package version', async ({ context }) => {
//       expect(context.payload.version).to.equal(Package.version);
//     });
//
//     test('environment', async ({ context }) => {
//       expect(context.payload.env).to.equal(process.env.NODE_ENV);
//     });
//
//   });
// });
