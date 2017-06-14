noteApp.addController('main', '/', function () {
    var that = this;
    var _notes = [];
    var _visibleNotes;
    var _sortedNotes;

    var _showCompleted = false;
    var _sortOrder = 1;

    var _view = this.app.getView('main');

    function compareDates(d1, d2) {
        if ((d1 === null) || (d2 === null)) {
            if ((d1 === null) && (d2 === null)) {
                return 0;
            } else if (d1 === null) {
                return 1;
            } else {
                return -1;
            }
        } else {
            return d1 - d2;
        }
    }

    function compareNotesByDueDate(a, b) {
        let val = compareDates(a.dueDate, b.dueDate);
        if (val === 0) {
            val = b.importance - a.importance;
        }
        return val;
    }

    function compareNotesByCreationDate(a, b) {
        let val = compareDates(a.creationDate, b.creationDate);
        if (val === 0) {
            val = b.importance - a.importance;
        }
        return val;
    }

    function compareNotesByImportance(a, b) {
        let val = b.importance - a.importance;
        if (val === 0) {
            val = a.dueDate - b.dueDate;
        }
        return val;
    }

    function sortNotes() {
        // determine the compare function to use for sorting the notes
        let compareFunc = null;
        switch(_sortOrder) {
            case 1:
                compareFunc = compareNotesByDueDate;
                break;
            case 2:
                compareFunc = compareNotesByCreationDate;
                break;
            case 3:
                compareFunc = compareNotesByImportance;
                break;
            default:
                throw 'Unknown sort order!';
        }

        // sort the notes
        _visibleNotes.sort(compareFunc);
    }

    function filterNotes() {
        if (_showCompleted) {
            _visibleNotes = _notes;
        } else {
            _visibleNotes = _notes.filter(function(note) {
                return !note.completed(); 
            });
        }
    }

    function renderView(load, filter) {
        if (load) {
            _notes = that.app.dataService.loadAll();
        }

        if (filter) {
            filterNotes();
        }

        sortNotes();

        _view.render({
            notes: _visibleNotes.map(function(n){ return new that.app.NoteView(n); }),
            noNotes: _notes.length === 0,
            noneVisible: _visibleNotes.length === 0,
            showCompleted: _showCompleted,
            sortByDueDate: _sortOrder === 1,
            sortByCreationDate: _sortOrder === 2,
            sortByImportance: _sortOrder === 3,
        });
    }

    _view.onRefresh = function() {
        renderView(true, true);
    };

    _view.onAddNewNote = function() {
        this.app.routerService.navigateTo('/editNote/0', true);
    };

    _view.onEditNote = function(id) {
        let note = _notes.find(n => n.id === id);
        if (note != null) {
            this.app.routerService.navigateTo('/editNote/' + id, true);
        }
    };

    _view.onDeleteNote = function(id) {
        if (this.app.dataService.delete(id)) {
            renderView(true, true);
        }
    };

    _view.onNoteCompletedChange = function(id, completed) {
        let note = _notes.find(n => n.id === id);
        if (note != null) {
            note.toggleCompleted();
            this.app.dataService.save(note);
            renderView(false, true);
        }
    };

    _view.onSortOrderChange = function(sortOrder) {
        if (_sortOrder !== sortOrder) {
            _sortOrder = sortOrder;
            renderView(false, false);
        }
    }

    _view.onShowCompletedChange = function() {
        _showCompleted = !_showCompleted;
        renderView(false, true);
    }

    this.afterActivating = function(){
        renderView(true, true);
    };

    this.beforeDeactivating = function(){
        _view.destroy();
    };
});