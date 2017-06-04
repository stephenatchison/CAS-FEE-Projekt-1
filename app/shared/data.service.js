window.noteApp.dataService = new (function(app) {
    var _app = app;
    var _notes = null;
    var _nextId = 1;

    function loadAllNotes() {
        if (_notes === null) {
            // load all notes from localStorage
            let notes = [];
            let key, strJson;
            for(let i = 0, ii = localStorage.length; i < ii; i++) {
                key = localStorage.key(i);
                if (key.startsWith('note_')) {
                    strJson = localStorage.getItem(key);
                    notes.push(new _app.Note(strJson));
                }
            }

            if (notes.length === 0) {
                notes.push(new _app.Note('{ "id": 1, "title": "Projekt 1 fertigstellen", "description": "CAS-FEE Projekt 1 muss fertiggestellt werden", "importance": 5, "creationDate": "2017-05-03", "dueDate": "2017-07-02", "completionDate": null}'));
                notes.push(new _app.Note('{ "id": 2, "title": "Steuern 2017", "description": "Steuererklärung ausfüllen", "importance": 4, "creationDate": "2017-02-28", "dueDate": "2017-05-31", "completionDate": null}'));
                notes.push(new _app.Note('{ "id": 3, "title": "AWS einführen", "description": "Das Projekt AWS muss eingeführt werden", "importance": 3, "creationDate": "2017-03-31", "dueDate": "2017-06-30", "completionDate": null}'));
                notes.push(new _app.Note('{ "id": 4, "title": "Umziehen", "description": "Ins neue Haus einziehen", "importance": 5, "creationDate": "2017-03-01", "dueDate": "2017-06-20", "completionDate": null}'));
                notes.push(new _app.Note('{ "id": 5, "title": "Haus abgeben", "description": "Das Haus (Nonnenmattstr. 26) muss wieder abgegeben werden", "importance": 5, "creationDate": "2017-03-01", "dueDate": "2017-06-30", "completionDate": null}'));
            }

            // store notes in object
            _notes = notes;

            // determine nextId
            _nextId = (_notes.length === 0) ? 1 : (_notes.map(e => e.id).sort((a, b) => b - a))[0] + 1;
        }
        return _notes;
    }

    function getNextId() {
        loadAllNotes();
        return _nextId++;
    }

    function saveNoteToLocalStorage(note) {
        localStorage.setItem('note_' + note.id, JSON.stringify(note));
    }

    this.loadAll = function(){
        return loadAllNotes();
    };

    this.save = function(note) {
        if (note != null) {
            if (note.id === 0) {
                note.setId(getNextId());
                _notes.push(note);
            } else {
                let n = _notes.find(e => e.id === note.id);
                n.update(note);
            }
            saveNoteToLocalStorage(note);
        }
    };
})(window.noteApp);