noteApp.addController('main', function () {
    var _notes = [];

    var _view = this.app.getView('main');
    _view.onEditNote = id => {
        let note = _notes.find(n => n.id === id);
        if (note != null) {
            this.app.setActiveController('editNote');
        }
    };
    _view.onDeleteNote = id => {

    };
    _view.onNoteCompletedChange = (id, completed) => {

    };

    this.afterActivating = function(){
        _notes = this.app.dataService.loadAll();
        _view.render({ notes: _notes });
    };

    this.beforeDeactivating = function(){
        _view.destroy();
    };
});