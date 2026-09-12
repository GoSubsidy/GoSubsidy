const http = require("http");
const port = 4000;
http.createServer((req,res)=>{
  if (req.url === "/test") {
    res.writeHead(200, {"Content-Type":"application/json"});
    res.end(JSON.stringify({ok:true,server:"quick-test"}));
  } else {
    res.writeHead(404); res.end("not found");
  }
}).listen(port, ()=> console.log("quick-test listening on", port));
