const net = require('net');
const http = require("http");
const uuid = require("uuid");

module.exports = function detectPort(port) {
  let svr = null;
  try {
    const id = uuid.snowflake().hex()
    const str = JSON.stringify({ id })
    svr = new http.Server(port, (req) => {
      req.response.write(str)
    });
    svr.run(() => { });
    
    const rep = http.get(`http://127.0.0.1:${port}`)
    let res = rep.read().toString();
    if (!res || res !== str) {
      throw 'err'
    }
  } catch (error) {
    svr = new http.Server(0, () => { });
    svr.run(() => { });
  } finally {
    port = svr.socket.localPort;
    svr.stop();
    return port;
  }
};
