#!/bin/bash

# Run database migrations
# node ace migration:run --force;

# Start the Node.js application
npm start

exec "$@"
