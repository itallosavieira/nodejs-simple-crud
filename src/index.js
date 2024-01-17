const http = require('http');
const { URL } = require('url');

const routes = require('./routes');
const bodyParser = require('./helpers/bodyParser');

const server = http.createServer((request, response) => {
  const parsedUrl = new URL(`http://localhost:5555${request.url}`);

  console.log(`Request Method: ${request.method} | Endpoint: ${parsedUrl.pathname}`)

  let { pathname } = parsedUrl;
  let id = null;

  const splitEndpoint = pathname.split('/').filter(Boolean)

  if (splitEndpoint.length > 1) {
    pathname = `/${splitEndpoint[0]}/:id`;
    id = splitEndpoint[1];
  }

  const route = routes.find((routeObj) => (
    routeObj.endpoint === pathname && routeObj.method === request.method
  ));


  if (route) {
    request.query = Object.fromEntries(parsedUrl.searchParams);
    request.params = { id };

    response.send = (statusCode, body) => {
      response.writeHead(statusCode, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(body));
    }

    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      return bodyParser(request, () => route.handler(request, response));
    } 

    return route.handler(request, response);
  }
  response.writeHead(404, { 'Content-Type': 'text/html' });
  response.end(`Cannot ${request.method} ${parsedUrl.pathname}`);
});

server.listen(5555, () => {
  console.log('✅ Server sarted at http://localhost:5555');
});