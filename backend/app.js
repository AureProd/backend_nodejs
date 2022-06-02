const http = require('http');
const express = require('express');
const router = require('./functions/router');
const mongoose = require('mongoose');

mongoose.connect(`mongodb://${process.env.BDD_USERNAME}:${process.env.BDD_PASSWORD}@${process.env.BDD_HOST}:${process.env.BDD_PORT}`)
    .then(() => console.log("Connection à la BDD réussie"))
    .catch(err => console.log(err));

const port = 3000;

const app = express();
const server = http.Server(app);

app.use(express.json());
app.use("/api", router);

server.listen(port);

console.log('API is listening on port ' + port);