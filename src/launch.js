#!/usr/bin/env node

const App = require('@fua/agent.app');

App.launch({
    app:    require('./app/app.js'),
    server: {
        port: 3000,
        app:  true,
        io:   true
    }
});
