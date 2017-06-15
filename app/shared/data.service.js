window.noteApp.dataService = (function(app) {
    var _app = app;
    var _lastLoadAllResult = null;
    var _notePrefix = 'note_';
    var _configPrefix = "config_";

    function loadAllNotes(keepResult) {
        // load all notes from localStorage
        let notes = [];
        let key, strJson;

        for(let i = 0, ii = localStorage.length; i < ii; i++) {
            key = localStorage.key(i);
            if (key.startsWith(_notePrefix)) {
                strJson = localStorage.getItem(key);
                notes.push(new _app.Note(strJson));
            }
        }

        if (keepResult) {
            _lastLoadAllResult = notes.slice();
            _lastLoadAllResult.sort((a, b) => a.id - b.id);
        }

        return notes;
    }

    function getNextId() {
        let notes = loadAllNotes(true);
        return (notes.length === 0) ? 1 : (notes.map(e => e.id).sort((a, b) => b - a))[0] + 1;
    }

    function detectIfChangesAvailable() {
        let notes = loadAllNotes(false);
        notes.sort((a, b) => a.id - b.id);

        if (_lastLoadAllResult === null) {
            _lastLoadAllResult = notes;
            return true;
        }

        if (notes.length !== _lastLoadAllResult.length) {
            _lastLoadAllResult = notes;
            return true;
        }

        for(let i = 0, ii = notes.length; i < ii; i++) {
            if (!notes[i].isSameAs(_lastLoadAllResult[i])) {
                _lastLoadAllResult = notes;
                return true;
            }
        }

        return false;
    }

    function getNoteStorageId(id) {
        return _notePrefix + id;
    }

    function getConfigStorageId(name) {
        return _configPrefix + name;
    }

    function saveNoteToLocalStorage(note) {
        localStorage.setItem(getNoteStorageId(note.id), JSON.stringify(note));
    }

    function removeNoteFromLocalStorage(note) {
        localStorage.removeItem(getNoteStorageId(note.id));
    }

    return {
        loadAllNotes: function(hitServer) {
            return hitServer ? loadAllNotes(true) : _lastLoadAllResult;
        },

        getChangesAvailable: function() {
            return detectIfChangesAvailable();
        },

        loadNote: function(id) {
            let strJson = localStorage.getItem(getNoteStorageId(id));
            return (strJson != null) ? new _app.Note(strJson) : null;
        },

        saveNote: function(note) {
            if (note != null) {
                if (note.id === 0) {
                    note.id = getNextId();
                }
                saveNoteToLocalStorage(note);
            }

            return note;
        },

        deleteNote: function(id) {
            let n = this.loadNote(id);
            if (n != null) {
                removeNoteFromLocalStorage(n);
                return true;
            } else {
                return false;
            }
        },

        loadConfig: function(name) {
            let strJson = localStorage.getItem(getConfigStorageId(name));
            return (strJson != null) ? JSON.parse(strJson) : null;
        },

        saveConfig: function(name, config) {
            if (config != null) {
                localStorage.setItem(getConfigStorageId(name), JSON.stringify(config));
            } else {
                localStorage.removeItem(getConfigStorageId(name));
            }
        }
    };
})(window.noteApp);