noteApp.addController('editNote', '/editNote', function (document) {
    var that = this;
    var _view = this.app.getView('editNote');
    var _note = null;

    function renderView() {
        _view.render(new that.app.NoteView(_note));
    }

    _view.onCancel = function() {
        that.app.routerService.navigateTo('/', true);
    };

    _view.onSubmit = function(note) {

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