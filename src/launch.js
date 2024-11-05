#!/usr/bin/env node

const App = require('@nrd/fua.agent.app');

App.launch({
    app:    require('./app/app.js'),
    server: {
        port: 3000,
        app:  true,
        io:   true
    }
});
