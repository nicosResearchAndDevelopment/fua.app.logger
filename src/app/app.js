const
    is      = require('@nrd/fua.core.is'),
    ts      = require('@nrd/fua.core.ts'),
    path    = require('path'),
    express = require('express'),
    ui      = require('@nrd/fua.service.ui');

module.exports = async function ({server: {app, io}, connector, ...config}) {

    app.get('/', (request, response) => response.redirect('/view'));

    app.use('/view', ui({
        lib: true,
        ext: {pattern: '/*socket.io*'},
        res: {pattern: '/nicos-rd/*'}
    }), express.static(path.join(__dirname, '../view')));

    app.use('/log', express.text(), function (request, response) {
        io.to('view').emit('log-request', {
            timestamp:   ts.dateTime(),
            method:      request.method,
            url:         request.url,
            httpVersion: request.httpVersion,
            headers:     request.headers,
            body:        is.string(request.body) ? request.body : null
        });
        response.format({
            'text/plain':       () => response.status(200).send('OK'),
            'text/html':        () => response.status(200).send('<p>OK</p>'),
            'application/json': () => response.status(200).send({message: 'OK'}),
            default:            () => response.status(200).end()
        });
    });

    io.on('connection', (socket) => {
        socket.on('subscribe', (room) => {
            if (is.string.token(room)) socket.join(room);
        });
    });

};
