# Ravelo overview & motivation

[![CircleCI](https://circleci.com/gh/opposite-bracket/ravelo/tree/master.svg?style=svg)](https://circleci.com/gh/ravelo-systematic-solutions/ravelo/tree/master)
[![codecov](https://codecov.io/gh/opposite-bracket/ravelo/branch/master/graph/badge.svg)](https://codecov.io/gh/opposite-bracket/ravelo)

My motivation for building this project is 
so that i can build a framework that gives
me the ability to split applications into
multiple independent services.

It is expected to have a **registry service**
which contains all configuration options for
all your services. This service can also be
a way to centralize the health of the entire
architecture much like a todo list of services
with its health/version status.

## Prerequisites

Please check the [.nvmrc](https://github.com/ravelo-systematic-solutions/ravelo/blob/master/.nvmrc)
file to see which version of node it is required.

## How to install

all you need to do is run `npm i -S ravelo`.

## Build your first service

All you need to get started (after you install
`ravelo` as the dependency) is the following on
your `index.js`:

```javascript
const Ravelo = require('ravelo');

const init = async () => {
  const server = await Ravelo.init();

  if (require.main === module) {
    console.log(`Ravelo Service: ${server.app.config.name}:${server.app.config.version}`);
    console.log(`Server running at: ${server.info.uri}`);
    await server.start();
  }

  return server;

};

module.exports = init();
```

the `Server` that `Ravelo.init()` returns is a hapijs
server. For more information about which version of
[hapi](https://hapijs.com/) we are using please refer to our
[package.js](https://github.com/ravelo-systematic-solutions/ravelo/blob/master/package.json).

## Troubleshooting

So far i haven't experienced any but i'm sure something will come up pretty soon.