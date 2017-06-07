noteApp.addController('editNote', function (document) {
    var _view = this.app.getView('editNote');
    var _note = null;

    this.afterActivating = function(){
        _view.render({ note: _note });
    };

    this.beforeDeactivating = function(){
        _view.destroy();
    };
});