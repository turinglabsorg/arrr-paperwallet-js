const util = require('util');
const secureRandom = require('secure-random')
const exec = util.promisify(require('child_process').exec);

var http = require('http');
http.createServer(async function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  var log = await getnewaddress() 
  res.end(JSON.stringify(log));
}).listen(1337)

console.log('SERVER LISTENING AT 1337')

async function getnewaddress() {
  return new Promise(async response => {
    var buf = secureRandom(512, {type: 'Buffer'})
    var random = buf.toString('hex')
    exec("./piratepaperwallet --nohd -z=1 -e=" + random, async function (error, stdout, stderr) {
        if(error){
           response('WALLET UNREACHABLE')
        }
        if(stderr){
            response('WALLET UNREACHABLE')
        }
        let generated = JSON.parse(stdout.replace('Generating 1 Sapling addresses.........[OK]',''))
        let wallet = {
            address: generated[0].address,
            private_key: generated[0].private_key
        }
        response(wallet)
    })
  })
}
