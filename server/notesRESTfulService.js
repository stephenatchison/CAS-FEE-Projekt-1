module.exports = class NotesRESTfulService {
    constructor() { }

    init(rootDir, router) {        
        this.__updateLastOperationTime();

        this.__initDataStore(rootDir);
        this.__initRouter(router);

        return router;
    }

    __initDataStore(rootDir) {
        let NotesDataStore = require('./notesDataStore');

        this.__datastore = new NotesDataStore();
        this.__datastore.init(rootDir);
    }

    __initRouter(router) {
        router.route('/api/notes/:id')
            .get(this.__loadNote.bind(this))
            .put(this.__updateNote.bind(this))
            .delete(this.__deleteNote.bind(this));

        router.route('/api/notes')
            .get(this.__loadNotes.bind(this))
            .post(this.__addNote.bind(this));
        
        router.all('/api/*', (request, response) => { this.__sendNotFound(response); });
    }

    __loadNotes(request, response) {
        if (request.query.hasOwnProperty('version')) {
            this.__sendOk(response, { version: this.__lastOperationTime });
        } else {
            this.__datastore.loadAll(
                (notes) => {
                    // send back the data as well as the last operation time (timestamp)
                    this.__sendOk(response, { notes: notes || [], version: this.__lastOperationTime });
                },
                (error) => {
                    this.__sendServerError(response, error);
                }
            );
        }
    }

    __loadNote(request, response) {
        this.__datastore.load(request.params.id,
            (note) => {
                if (note) {
                    this.__sendOk(response, note);
                } else {
                    this.__sendNotFound(response);
                }
            },
            (error) => {
                this.__sendServerError(response, error);
            }
        );
    }

    __updateNote(request, response) {
        if (!request.body) {
            this.__sendBadRequest(response);
        } else {
            let note = request.body;
            let id = request.params.id;

            if (note._id !== id) {
                this.__sendBadRequest(response);
            } else {
                this.__datastore.update(note,
                    (count) => {
                        if (count === 0) {
                            this.__sendNotFound(response);
                        } else {
                            this.__updateLastOperationTime();
                            this.__sendOk(response);
                        }
                    },
                    (error) => {
                        this.__sendServerError(error);        
                    }
                );
            }
        }
    }

    __deleteNote(request, response) {
        this.__datastore.delete(request.params.id,
            (count) => {
                if (count > 0) {
                    this.__updateLastOperationTime();
                }
                this.__sendOk(response);
            },
            (error) => {
                this.__sendServerError(response, error);
            }
        );
    }

    __addNote(request, response) {
        if (!request.body) {
            this.__sendBadRequest(response);
        } else {
            this.__datastore.add(request.body,
                (note) => {
                    this.__updateLastOperationTime();
                    this.__sendOk(response, note, 201);
                },
                (error) => {
                    this.__sendServerError(response);
                }
            );
        }
    }

    __updateLastOperationTime() {
        this.__lastOperationTime = new Date().getTime();
    }

    __sendOk(response, data, status = 200) {
        if (typeof data === 'undefined') {
            status = 204;
        }

        this.__sendResponse(response, data, status);
    }

    __sendServerError(response, data) {
        this.__sendResponse(response, data, 500);
    }

    __sendNotFound(response) {
        this.__sendResponse(response, '', 404);
    }

    __sendBadRequest(response) {
        this.__sendResponse(response, '', 400);
    }

    __sendResponse(response, data, status) {
        if (typeof data !== 'undefined') {
            response.setHeader('Content-Type', (typeof data === 'object') ? 'application/json' : 'text/plain');
        }
        response.status(status);
        response.send((typeof data === 'object') ? JSON.stringify(data) : data);
    }
}