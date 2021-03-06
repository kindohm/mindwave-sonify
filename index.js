let mahWS;
let Cylon = require('cylon');
const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
const app = express();

app.use('/static', express.static('public'))
app.use('/node_modules', express.static('node_modules'))

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
    mahWS = ws;
    const location = url.parse(req.url, true);
});

wss.on('close', () => {
    console.log('WS CLOSED!!!');
    mahWS = null;
});

server.listen(8080, function listening() {
    console.log('Listening on %d', server.address().port);
});

// USE THE OUTGOING PORT NUMBER AFTER REBOOT.
Cylon.robot({
    connections: {
        neurosky: { adaptor: 'neurosky', port: 'COM4' }
    },

    devices: {
        headset: { driver: 'neurosky' }
    },

    work: function (my) {

        console.log('working.');

        my.headset.on('eeg', function (data) {
            var factor = 20000000;
            var msg = {
                delta: data.delta / factor,
                theta: data.theta / factor,
                loAlpha: data.loAlpha / factor,
                hiAlpha: data.hiAlpha / factor,
                loBeta: data.loBeta / factor,
                hiBeta: data.hiBeta / factor,
                loGamma: data.loGamma / factor,
                midGamma: data.midGamma / factor
            };

            console.log('eeg', msg);
            if (!mahWS) {
                return;
            }

            try {
                mahWS.send(JSON.stringify({
                    type: 'eeg', data: msg
                }));
            }
            catch (err) {
                console.error('could not send message on socket', err);
            }
        });

        my.headset.on('meditation', function (data) {
            console.log('meditation', data);
            if (!mahWS) {
                return;
            }

            try {
                mahWS.send(JSON.stringify({ type: 'meditation', data: data }));
            }
            catch (err) {
                console.error('error sending meditation!', err);
            }

        });

        my.headset.on('attention', function (data) {

            if (data === 128 || data === 0) return;

            console.log('attention', data);
            if (!mahWS) {
                return;
            }

            try {
                mahWS.send(JSON.stringify({ type: 'attention', data: data }));
            }
            catch (err) {
                console.error('error sending attention!', err);
            }

        });

        my.headset.on('blink', function (data) {
            console.log('BLINK', data);
            if (!mahWS) {
                return;
            }

            try {
                mahWS.send(JSON.stringify({ type: 'blink' }));
            } catch (err) {
                console.error('error sending blink!', err);

            }

        });

    }
}).start();