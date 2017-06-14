noteApp.addController('editNote', '/editNote', function (document) {
    var that = this;
    var _view = this.app.getView('editNote');
    var _note = null;

    function renderView() {
        _view.render(new that.app.NoteView(_note));
    }

    function gotoOverview() {
        that.app.routerService.navigateTo('/', true);
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

        that.app.dataService.save(_note);
        gotoOverview();
    };

    this.afterActivating = function(){
        let tokens = this.app.window().location.pathname.split('/');
        id = Number(tokens[tokens.length - 1]);
        if (id === 0) {
            _note = null;
        } else {
            _note = this.app.dataService.getNote(id);
        }
        renderView();
    };

    this.beforeDeactivating = function(){
        _view.destroy();
    };
});