noteApp.addController('main', function (document) {
    var view = (function() {
        var template = this.compileTemplate('main');
        var noteTemplate = this.compileTemplate('noteListEntry');
    })();
});