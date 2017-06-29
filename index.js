"use strict";

var NotesServer = require('./server/notesServer');

var server = new NotesServer(3000, __dirname);
server.init();
server.run();
