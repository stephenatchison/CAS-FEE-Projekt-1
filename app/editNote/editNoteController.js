noteApp.addController('editNote', '/editNote', function (document) {
    var that = this;
    var _view = this.app.getView('editNote');
    var _note = null;

    this.afterActivating = function(){
        let tokens = this.app.window().location.pathname.split('/');
        id = Number(tokens[tokens.length - 1]);
        _note = this.app.dataService.getNote(id);
        _view.render({ note: _note });
    };

    this.beforeDeactivating = function(){
        _view.destroy();
    };
});