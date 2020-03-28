const express = require('express');
const path = require('path');
const app = express();
const child_process = require('child_process');

child_process.execSync('react-env', {
    stdio: [0, 1, 2],
});

app.get(['/env.js', '/status-page/env.js'], function(req, res) {
    let REACT_APP_FYIPE_HOST = null;
    if (!process.env.FYIPE_HOST) {
        if (req.host.includes('localhost')) {
            REACT_APP_FYIPE_HOST = req.protocol + '://' + req.host;
        } else {
            REACT_APP_FYIPE_HOST = req.protocol + '://' + req.host;
        }
    } else {
        REACT_APP_FYIPE_HOST = process.env.FYIPE_HOST;
        if (REACT_APP_FYIPE_HOST.includes('*.')) {
            REACT_APP_FYIPE_HOST = REACT_APP_FYIPE_HOST.replace('*.', ''); //remove wildcard from host.
        }
    }

    const env = {
        REACT_APP_FYIPE_HOST,
    };

    res.contentType('application/javascript');
    res.send('window._env = ' + JSON.stringify(env));
});

app.use(express.static(path.join(__dirname, 'build')));
app.use('/status-page', express.static(path.join(__dirname, 'build')));

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(3006);
