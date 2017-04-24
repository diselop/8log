const app = require('express')();
const randomString = require('./helpers/randomString');
const Busboy = require('busboy');
const fs = require('fs');
const path = require('path');
const sha1File = require('sha1-file');
const sha1 = require('sha1');
const Config = require('./lib/config').Config;
const bodyParser = require('body-parser');
const wget = require('wget');

const config = new Config();
const dirname = config.get('options').dirname;
const bulb = config.get('options').bulb;

app.use(bodyParser.json({ limit: '1024mb' }));
app.use(bodyParser.urlencoded({
    limit: '1024mb',
    extended: true
}));

app.use((req, res, next) => {
    if (req.path === '/bulb') {
        setTimeout(() => {
            if (!res.finished) {
                res.status(504).json({
                    code: 504,
                    message: "gateway"
                });
            }
        }, 5000);
    } else if (req.path === '/jungo') {
        setTimeout(() => {
            if (!res.finished) {
                res.status(404).json({
                    code: 404,
                    message: "file not found"
                });
            }
        }, 10000);

    }
    next();
});

app.post('/bulb', (req, res) => {
    const startTime = process.hrtime();
    const busboy = new Busboy({ headers: req.headers });
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        const saveFileName = randomString.file();
        const filePath = path.join(dirname, saveFileName);
        file.pipe(fs.createWriteStream(filePath));
        file.on('end', () => {
            sha1File(filePath, (error, sum) => {
                if (error) {
                    global.console.log(error);
                }
                const data = sha1(`${sum}${bulb}`);
                const xrt = randomString.diffTime(startTime);
                if (!res.finished) {
                    res
                        .header({ "X-RESPONSE-TIME": Math.ceil(xrt) })
                        .json({ data });
                }
            });
        });
    });
    req.pipe(busboy);
});

app.post('/jungo', (req, res) => {
    const saveFileName = randomString.file();
    const filePath = path.join(dirname, saveFileName);
    const startTime = process.hrtime();
    const xrt = randomString.diffTime(startTime);
    let hashFiles = [];
    req.body.map(file => {
        const download = wget.download(file, filePath);
        download.on('error', () => {
            res.status(404).json({
                code: 404,
                message: "file not found"
            });
        });
        download.on('end', () => {
            sha1File(filePath, (error, sum) => {
                if (error) {
                    global.console.log(error);
                }
                hashFiles.push(sha1(`${sum}${bulb}`));
                if (!res.finished && req.body.length === hashFiles.length) {
                    res
                        .header({ "X-RESPONSE-TIME": Math.ceil(xrt) })
                        .json(hashFiles);
                }
            });
        });
    })
});

app.listen(process.env.port || 3000, () => {
    global.console.log('Example app listening on port 3000!');
});


