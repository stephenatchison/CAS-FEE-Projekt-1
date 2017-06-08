window.noteApp.addController('app', null, function(){
    var _view = this.app.getView('app');
    _view.themeChanged = name => {
        _view.setTheme(name);
    };

    _view.setTheme('hell');
});
