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
  const server = await Ravelo.init();

  if (require.main === module) {
    server.log(`Ravelo Service: ${server.app.config.name}:${server.app.config.version}`);
    server.log(`Server running at: ${server.info.uri}`);
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
  "registry": {
    "enableServiceController": true,
    "enableRegistryController": true,
    "service": {
      "port": 3000,
      "host": "localhost"
    },
    "debug": { "request": [ "error" ] },
    "internalURL": "http://localhost:3000"
  }
}
```

Bare in mind that you will need to replace `registry`
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
    "name": "registry",
    "version": "1.0.0",
    "env": "local"
}
```

Now visit [http://localhost:3000/_registry/health](http://localhost:3000/_registry/health).
If everything went well, you should be able to see the following:

```json
{
    "registry": {
        "statusCode": 200,
        "version": "1.0.0",
        "env": "local"
    }
}
```

### Build your second service (consumer service)

We're calling this a `consumer service`  thinking
that its purpose is to be used by an application
through a set of APIs. This service will hit the
registry service to pull the configuration options
from the registry before running.

The first thing we do is to go back to the registry repo
and update the `config/local.json` to the following
and restart the `registry` service for the configuration
changes to take effect system wide:

```json
{
  "registry": {
    "enableServiceController": true,
    "enableRegistryController": true,
    "service": {
      "port": 3000,
      "host": "localhost"
    },
    "debug": { "request": [ "error" ] },
    "internalURL": "http://localhost:3000"
  },
  "consumer": {
    "enableServiceController": true,
    "enableGatewayAccess": true,
    "service": {
      "port": 3002,
      "host": "localhost"
    },
    "debug": {
      "request": [ "error" ]
    },
    "internalURL": "http://localhost:3002"
  }
}
```

if you hit [http://localhost:3000/_registry/health](http://localhost:3000/_registry/health)
you should see the following response:

```json
{
  "registry": {
    "statusCode": 200,
    "version": "1.0.0",
    "env": "local"
  },
    "consumer": {
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
  const server = await Ravelo.init();

  if (require.main === module) {
    server.log(`Ravelo Service: ${server.app.config.name}:${server.app.config.version}`);
    server.log(`Server running at: ${server.info.uri}`);
    await server.start();
  }

  return server;
};

module.exports = init();
```

You can see that this snippet of code
looks exactly to the `index.js` file in the `registry`
service look exactly the same as the one placed in the
`consumer` service. Its behaviour comes from the
configuration where each service is meant to do
different things.

Now start the consuer service by running the following
on a new tab:


```jshelllanguage
$ NODE_ENV=local node index.js
```

.. if you hit [http://localhost:3000/_registry/health](http://localhost:3000/_registry/health) (which is
the registry health endpoint), you should see the
following response:

```json
{
  "registry": {
    "statusCode": 200,
    "version": "1.0.0",
    "env": "local"
  },
  "consumer": {
    "statusCode": 200,
    "name": "consumer",
    "version": "1.0.0",
    "env": "local"
  }
}
```

this means that you now have 2 services running however,
my consumer isn't really doing anything at all so i'm
going add a simple `hello world` endpoint by adding
the following after `const server = await Ravelo.init();`:

```javascript

  // ...
  server.route({
    method: 'GET',
    path: '/hello-world',
    handler: async () => {
      return {
        message: 'Hello World'
      };
    }
  });
  // ...
```

Remember that the server is a plain [hapijs](https://hapijs.com/) server so what you do with it
is read its documentation if you are not familiar
with the framework! anyways, restart the server and
hit [http://localhost:3001/hello-world](http://localhost:3001/hello-world). If you see the
following then you are on the right path:

```json
{
  "message": "Hello World"
}
```

### Build your third service (gateway service)

The next thing you may want to do is to implement
a way to protect your endpoints behind a gateway.
Say your gateway is in a public subnet and the rest
of your services leave within a private subnet SO,
the next thing is to build a gateway service.

Lets update the `config/local.json` to the following:

```json
{
  "registry": {
    "enableRegistryController": true,
    "enableServiceController": true,
    "service": {
      "port": 3000,
      "host": "localhost"
    },
    "debug": { "request": [ "error" ] },
    "internalURL": "http://localhost:3000"
  },
  "consumer": {
    "enableServiceController": true,
    "enableGatewayAccess": true,
    "service": {
      "port": 3001,
      "host": "localhost"
    },
    "debug": { "request": [ "error" ] },
    "internalURL": "http://localhost:3001"
  },
  "gateway": {
    "enableGatewayProxy": true,
    "enableServiceController": true,
    "service": {
      "port": 3002,
      "host": "localhost"
    },
    "debug": { "request": [ "error" ] },
    "internalURL": "http://localhost:3002"
  }
}
```

NOTE: Don't forget that since you are adding new
config options, you need to restart the `registry`
service. The consumer service does not need to be
restarted at the moment, because we don't need
the consumer to communicate to the gateway service
**AND** the consumer service isn't affected by the
changes made in the registry service at the moment.

Now we do the same we've been doing for the other
services which is install `ravelo` as a dependency
and create that `index.js` with the same content:

```javascript
const Ravelo = require('ravelo');

const init = async () => {
  const server = await Ravelo.init();

  if (require.main === module) {
    server.log(`Ravelo Service: ${server.app.config.name}:${server.app.config.version}`);
    server.log(`Server running at: ${server.info.uri}`);
    await server.start();
  }

  return server;
};

module.exports = init();
```

and start the `gateway` service by running:

```jshelllanguage
$ NODE_ENV=local node index.js
```

then hit [http://localhost:3000/_registry/health](http://localhost:3000/_registry/health):

```json
{
  "registry": {
    "statusCode": 200,
    "version": "1.0.0",
    "env": "local"
  },
  "consumer": {
    "statusCode": 200,
    "name": "consumer",
    "version": "1.0.0",
    "env": "local"
  },
  "gateway": {
    "statusCode": 200,
    "name": "gateway",
    "version": "1.0.0",
    "env": "local"
  }
}
```

Now when hit the consumer API through the gateway
[http://localhost:3002/consumer/hello-world](http://localhost:3002/consumer/hello-world)
you should see the same as if you were hitting
the consumer api itself
[http://localhost:3001/hello-world](http://localhost:3001/hello-world)

## Troubleshooting

So far we haven't experienced any but we're sure something will come up pretty soon.

# Disclaimer

Use this project at your own risk. We do not becom responsible for the security
of your application should you choose this project. Make sure you know what you
are doing should you use this in production environments.