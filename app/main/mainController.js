noteApp.addController('main', function () {
    var _view = this.app.getView('main');
    var _notes = [];

    this.afterActivating = function(){
        _notes = this.app.dataService.loadAll();
        _view.render({notes: _notes});
    };
});