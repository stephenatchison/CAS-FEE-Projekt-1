noteApp.addController('main', '/', function () {
    var _notes = [];

    var _view = this.app.getView('main');
    _view.onEditNote = function(id) {
        let note = _notes.find(n => n.id === id);
        if (note != null) {
            this.app.routerService.navigateTo('/editNote/' + id);
        }
    };
    _view.onDeleteNote = function(id) {

    };
    _view.onNoteCompletedChange = function(id, completed) {

    };

    this.afterActivating = function(){
        _notes = this.app.dataService.loadAll();
        _view.render({ notes: _notes });
    };

    this.beforeDeactivating = function(){
        _view.destroy();
    };
});