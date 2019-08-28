const util = require('util');
const secureRandom = require('secure-random')
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
var QRCode = require('qrcode');
var express = require('express');
var app = express();
app.use(express.static('public'))

app.get('/', async function (req, res) {
  var log = await getnewaddress()
  fs.readFile('index.html', function (err, data) {
    if (err) {
      res.statusCode = 500;
      res.end(`Error getting the file: ${err}.`);
    } else {
      QRCode.toDataURL(log.address, {
        errorCorrectionLevel: 'H',
        rendererOpts: {
          width: 1500
        }
      }, function (err, qr) {
        let html = data.toString('utf8');
        html = html.replace("wallet: ''", "wallet: " + JSON.stringify(log))
        html = html.replace("qrcode: ''", "qrcode: '" + qr + "'")
        res.setHeader('Content-type', 'text/html');
        res.end(html);
      })
    }
  });
});

app.listen(1337);

console.log('SERVER LISTENING AT 1337')

async function getnewaddress() {
  return new Promise(async response => {
    var buf = secureRandom(512, { type: 'Buffer' })
    var random = buf.toString('hex')
    exec("./piratepaperwallet --nohd -z=1 -e=" + random, async function (error, stdout, stderr) {
      if (error) {
        response('WALLET UNREACHABLE')
      }
      if (stderr) {
        response('WALLET UNREACHABLE')
      }
      let generated = JSON.parse(stdout.replace('Generating 1 Sapling addresses.........[OK]', ''))
      let wallet = {
        address: generated[0].address,
        private_key: generated[0].private_key
      }
      response(wallet)
    })
  })
}
