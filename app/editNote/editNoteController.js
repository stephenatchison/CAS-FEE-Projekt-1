noteApp.addController('editNote', 'editNote', function (document) {
    var that = this;
    var _view = this.app.getView('editNote');
    var _note = null;

    function renderView() {
        _view.render(new that.app.NoteView(_note));
    }

    function gotoOverview() {
        that.app.routerService.navigateTo('', true);
    }

    _view.onCancel = function() {
        gotoOverview();
    };

    _view.onSubmit = function(note) {
        if (_note === null) {
            _note = new that.app.Note();
        }

        _note.title = note.title;
        _note.description = note.description;
        _note.importance = Number(note.importance);
        _note.dueDate = new Date(note.dueDate);

        that.app.dataService.saveNote(_note);
        gotoOverview();
    };

    this.afterActivating = function(){
        let tokens = location.pathname.split('/');
        let idx = tokens.indexOf('editNote');
        let id;
        if ((idx >= 0) && (tokens.length > idx + 1)) {
            id = Number(tokens[tokens.length - 1]);
        } else {
            id = 0;
        }
        if (id === 0) {
            _note = null;
        } else {
            _note = this.app.dataService.loadNote(id);
        }
        renderView();
    };

    this.beforeDeactivating = function(){
        _view.destroy();
    };
});