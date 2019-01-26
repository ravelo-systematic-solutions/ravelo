# Ravelo overview & motivation

[![CircleCI](https://circleci.com/gh/opposite-bracket/ravelo/tree/master.svg?style=svg)](https://circleci.com/gh/opposite-bracket/ravelo/tree/master)
[![codecov](https://codecov.io/gh/opposite-bracket/ravelo/branch/master/graph/badge.svg)](https://codecov.io/gh/opposite-bracket/ravelo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

My motivation for building this project is 
so that we can build a framework that gives
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

### Build your first service (registry service)

To get started, we are going to build a service
that takes care of centralizing config information
for all services. And giving you a set of
functionality to find out the health of your
architecture.

Once you install `ravelo` as the dependency,
do as follows in your `index.js`:

```javascript
const Ravelo = require('ravelo');

const init = async () => {
  const server = await Ravelo.init({
    enableServiceController: true,
    enableRegistryController: true
  });

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
[package.js](https://github.com/opposite-bracket/ravelo/blob/master/package.json).

Next, create `config/local.json` and add the following:

```json
{
  "service-name": {
    "service": {
      "port": 3000,
      "host": "localhost"
    },
    "debug": { "request": [ "error" ] },
    "internalURL": "localhost:3000"
  }
}
```

Bare in mind that you will need to replace `service-name`
with the name you'll find in your `package.json`.

The next thing you need to do is run it but make sure that
you set the NODE_ENV environment variable to `local`:

```jshelllanguage
$ NODE_ENV=local node index.js
```

and visit [http://localhost:3000/_service](http://localhost:3000/_service).
If everything went well, you should be able to see the following:

```json
{
    "name": "service-name",
    "version": "1.0.0",
    "env": "local"
}
```


Now visit [http://localhost:3000/_registry/health](http://localhost:3000/_registry/health).
If everything went well, you should be able to see the following:

```json
{
    "ssms_registry": {
        "statusCode": 200,
        "version": "1.0.0",
        "env": "local"
    }
}
```

### Build your second service (consumer service)

We're calling this a `consumer service`  thinking
that its purpose is to be used by an application.
This service will hit the registry service to pull
the configuration options from the registry before
running.

The first thing we do is to go back to the registry repo
and update the `config/local.json` to the following:

```json
{
  "service-name": {
    "service": {
      "port": 3000,
      "host": "localhost"
    },
    "debug": { "request": [ "error" ] },
    "internalURL": "localhost:3000"
  },
  "consumer-service": {
    "service": {
      "port": 3001,
      "host": "localhost"
    },
    "debug": { "request": [ "error" ] },
    "internalURL": "localhost:3001"
  }
}
```

if you hit [http://localhost:3000/_registry/health](http://localhost:3000/_registry/health)
you should see the following response:

```json
{
  "service-name": {
    "statusCode": 200,
    "version": "1.0.0",
    "env": "local"
  },
    "consumer-registry": {
    "statusCode": 503,
    "description": "Service not available"
  }
}
```

now we have 2 services registered in the registry service and
now i want to add my consumer registry. Create a new repo,
install ravelo as a dependency and add the following to `index.js`:

```javascript
const Ravelo = require('ravelo');

const init = async () => {
  const server = await Ravelo.init({
    enableServiceController: true
  });

  if (require.main === module) {
    console.log(`Ravelo Service: ${server.app.config.name}:${server.app.config.version}`);
    console.log(`Server running at: ${server.info.uri}`);
    await server.start();
  }

  return server;
};

module.exports = init();
```

The only difference is that we are not enabling registry controllers `enableRegistryController`.

## Troubleshooting

So far we haven't experienced any but we're sure something will come up pretty soon.

# Disclaimer

Use this project at your own risk. We do not becom responsible for the security
of your application should you choose this project. Make sure you know what you
are doing should you use this in production environments.