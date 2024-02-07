require("dotenv").config();
const Server = require("./Models/server");
const server = new Server;
server.listen();
var flash = require('express-flash')

