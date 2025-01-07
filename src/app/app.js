const
    is      = require('@fua/core.is'),
    ts      = require('@fua/core.ts'),
    path    = require('path'),
    express = require('express'),
    ui      = require('@fua/service.ui');

module.exports = async function ({server: {app, io}, connector, ...config}) {

    app.set('case sensitive routing', true);
    app.set('query parser', false);
    app.set('strict routing', true);
    app.set('x-powered-by', false);

    app.get('/', (request, response) => response.redirect('/view'));

    app.use('/view', ui({
        lib: true,
        ext: {pattern: '/*socket.io*'},
        res: {pattern: '/nicos-rd/*'}
    }), express.static(path.join(__dirname, '../view')));

    app.use('/log', express.text({type: '*/*'}), function (request, response) {
        io.to('view').emit('log-request', {
            timestamp: ts.dateTime(),
            version:   request.httpVersion,
            method:    request.method,
            url:       request.originalUrl,
            headers:   request.headers,
            body:      request.body || null
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
