import Layout from './lib/gui.layout.mjs';
import RequestLog from './gui.request-log.mjs';
import io from './ext/socket.io-client-3.1.3.mjs';

const
    socket     = io(),
    layout     = new Layout(document.body),
    requestLog = new RequestLog(layout.createCell(0, 0, 1, 1));

layout.defineLayout(
    /* rows: */[100],
    /* columns: */[100]
);

socket.on('connect', () => {
    socket.emit('subscribe', 'view');
}).on('log-request', (request) => {
    requestLog.addRequest(request);
});
