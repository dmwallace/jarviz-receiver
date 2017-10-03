import http from 'http'
import app from './jarviz-receiver'

const server = http.createServer(app);
let currentApp = app;
const port = 5000;
server.listen(port);
console.log(`Listening on port ${port}`);


if (module.hot) {
    module.hot.accept('./jarviz-receiver', () => {
        server.removeListener('request', currentApp);
        server.on('request', app);
        currentApp = app
    })
}
