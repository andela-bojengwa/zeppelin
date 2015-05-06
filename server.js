import express from 'express';
import bodyParser from 'body-parser';
import dockerx from 'docker-transfer';
import moment from 'moment';

let app = express();

// Serve static files
app.use(express.static(__dirname + '/build'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist/css'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/images', function(req, res) {
    dockerx.client.listImages().then(json => res.json(json));
});

app.post('/transfer', function(req, res) {
    let imageHash = req.body.imageHash;
    let host = req.body.host;
    let port = req.body.port;
    dockerx.client.sendImage(imageHash, host, port);
    res.send(timestamp() + "TRANSFER: Init transfer of " + imageHash + " to " + host + ":" + port + "\n");
});

app.post('/receive', function(req, res) {
    let name = "lolubuntu";
    let port = req.body.port;
    dockerx.server.receive(name, port).then(
        res.send(timestamp() + " RECEIVE: Init docker-transfer server listening at " + port + "\n")
    );
});

function timestamp() {
    return moment().format('YYYY-MM-DD h:mm:ss');
}

// Run server
let server = app.listen(8000, function () {
    let host = server.address().address;
    let port = server.address().port;

    console.log('Zeppelin listening at http://%s:%s', host, port);
});
