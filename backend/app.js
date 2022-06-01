const http = require('http');
const express = require('express');
const router = require('./functions/router');
const bdd = require('./functions/bdd_controller');

const port = 3000;

const app = express();
const server = http.Server(app);

app.use(express.json());
app.use("/api", router);

server.listen(port);

console.log('API is listening on port ' + port);