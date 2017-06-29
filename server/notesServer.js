module.exports = class NotesServer {
    constructor(port, path) {
		this.__port = port;
        this.__path = path;

        this.__server = null;
    }

	init() {
        // init express
		this.__express = require('express');
		this.__app = this.__express();

        // init the server middlewares
        this.__initWebServer();
        this.__initNotesService();
        
        // redirect all other requests to the website
        this.__app.use('/', (request, response) => { response.redirect('/ui'); });

	}

	run() {
		this.__server = this.__app.listen(this.__port, () => { console.log('Server running at http://localhost:' + this.__server.address().port) + '...'; });
	}

	__initWebServer() {
	    this.__app.use('/ui', this.__express.static('static'));
        this.__app.get('/ui*', (request, response) => {
	        response.setHeader('Content-Type', 'text/html; charset=utf-8');
	        response.sendFile(this.__path + '/static/index.html');
        });
    }

    __initNotesService() {
        // add body-parser middleware (json)
        let bodyParser = require('body-parser');
        this.__app.use(bodyParser.json());

        // add RESTful service for notes
        let NotesService = require('./notesRESTfulService');
        let svc = new NotesService();
        this.__app.use(svc.init(this.__path, this.__express.Router()));
    }
}