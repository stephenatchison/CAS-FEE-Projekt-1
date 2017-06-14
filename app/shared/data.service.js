window.noteApp.dataService = new (function(app) {
    var _app = app;

    function loadAllNotes() {
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

        return notes;
    }

    function getNextId() {
        let notes = loadAllNotes();
        return (notes.length === 0) ? 1 : (notes.map(e => e.id).sort((a, b) => b - a))[0] + 1;
    }

    function getStorageId(id) {
        return 'note_' + id;
    }

    function saveNoteToLocalStorage(note) {
        localStorage.setItem(getStorageId(note.id), JSON.stringify(note));
    }

    function removeNoteFromLocalStorage(note) {
        localStorage.removeItem(getStorageId(note.id));
    }

    this.loadAll = function(){
        return loadAllNotes();
    };

    this.getNote = function(id) {
        let strJson = localStorage.getItem(getStorageId(id));
        return (strJson != null) ? new _app.Note(strJson) : null;
    };

    this.save = function(note) {
        if (note != null) {
            if (note.id === 0) {
                note.id = getNextId();
            }
            saveNoteToLocalStorage(note);
        }

        return note;
    };

    this.delete = function(id) {
        let n = this.getNote(id);
        if (n != null) {
            removeNoteFromLocalStorage(n);
            return true;
        } else {
            return false;
        }
    };
})(window.noteApp);