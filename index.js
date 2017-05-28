var Cylon = require('cylon');
const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

const app = express();

app.use('/static', express.static('public'))
app.use('/node_modules', express.static('node_modules'))

// app.use(function (req, res) {
//   res.send({ msg: "hello" });
// });

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

var mahWS;

wss.on('connection', function connection(ws, req) {
    mahWS = ws;
    const location = url.parse(req.url, true);

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.send('OH HAI.');
});

server.listen(8080, function listening() {
    console.log('Listening on %d', server.address().port);
});



// USE THE OUTGOING PORT NUMBER AFTER REBOOT.
Cylon.robot({
    connections: {
        neurosky: { adaptor: 'neurosky', port: 'COM8' }
    },

    devices: {
        headset: { driver: 'neurosky' }
    },

    work: function (my) {

        console.log('work.');

        my.headset.on('attention', function (data) {
            console.log("attention:", data);
            if (!mahWS) {
                console.warn('no websocket');
                return;
            };
            mahWS.send(JSON.stringify({type: 'attention', data: data}));
        });

        my.headset.on('meditation', function (data) {
            console.log("meditation:", data);
            if (!mahWS) {
                console.warn('no websocket');
                return;
            };
            mahWS.send(JSON.stringify({type: 'meditation', data: data}));
        });
    }
}).start();