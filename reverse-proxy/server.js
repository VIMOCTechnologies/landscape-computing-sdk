/*
 * copyright statement
 *
 *//////////////////////

/* Description 
 *
 * This is a simple reverse proxy which goal is to add
 * the VIMOC developer key to any request such that
 * the apiKey is not required to be present on the client
 * 
 * Using a reverse proxy is considered best practice
 * when building client apps (Mobile or Web) which 
 * access third party APIs
 *
 * the proxy configuration can be found in env.json 
 *
 *///////////////////////////////

var fs = require('fs'),
    common = require('./common'),
    config = common.config() ;

if (config.dev) {
    console.log('//////////////////////////////////////') ;
    console.log('// Proxy Configuration                ') ;
    console.log('//                 ') ;
    console.log(config) ;
    console.log('//                 ') ;
    console.log('//////////////////////////////////////') ;
}

var apiKey = config.api_key,
    apiGateway = config.vimoc_api_gateway,
    proxyPort = config.proxy_port ;

var key = 'key='+apiKey ;

var http = require('http'),
    //https = require('https'),                //The reverse proxy can be configured to use SSL
    httpProxy = require('http-proxy'),         //https://www.npmjs.com/package/http-proxy
    url = require('url');

var logger = function() {    
  // This will only run once
  var logFile = fs.createWriteStream('./requests.log');

  return function (request, response, next) { 
    // This will run on each request.
    logFile.write(JSON.stringify(response.body)) ;
    //logFile.write(JSON.stringify(request.headers, true, 2));
    next();
  }
}

var proxy = httpProxy.createProxyServer(logger(),{});

var enableCORS = function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
 
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

http.createServer(function(req, res) {
    
    enableCORS(req,res,function() {

    if (config.dev) {
        var hostname = req.headers.host.split(":")[0];
        console.log(hostname + ' :: ' + req.url) ;
    }

    var requrl = req.url ;
    var queryObject = url.parse(requrl,true).query;

    var empty = (Object.keys(queryObject).length === 0) ;
    if (empty) {
        var sep = '?' ;
        if (requrl[requrl.length-1] !== '/') sep = '/?' ;
        req.url = requrl + sep + key ;
    } else {
	    req.url = requrl + '&' + key ;
    } 

    if (config.dev) { console.log(req.url) ; }

    // uncomment the localhost line and comment the apiGateway line
    // if you want to test the proxy wiht the local http server on
    // port 9081
    proxy.web(req, res, 
       {target:
            //'localhost:9081'
            apiGateway , secure: false 
       } 
    );
    }) ;

}).listen(proxyPort, function() {
    console.log('proxy listening on port '+proxyPort);
});

if (config.dev) {
    //This can be used to inspect the proxy's request
	http.createServer(function (req, res) {
   		res.writeHead(200, { 'Content-Type': 'text/plain' });
   		var pathname = url.parse(req.url).pathname;
	   	var queryObject = url.parse(req.url,true).query;
   		res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2) + '\n' + JSON.stringify(queryObject));
  
  		res.end();

	}).listen(9081);
}
