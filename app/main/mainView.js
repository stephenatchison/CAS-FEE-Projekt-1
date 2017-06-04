window.noteApp.addView('main', function() {
    this.viewName = 'mainView';

    this.onEditNote = null;
    this.onDeleteNote = null;
    this.onNoteCompleted = null;

    this.afterActivating = function() {
    };

    this.beforeDeactivating = function() {
    };

    this.beforeRendering = function(elem) {
        $('#notes', elem).off('click');
    }

    this.afterRendering = function(elem) {
        $('#notes', elem).on('click', ':button', e => {
            let id = e.target.dataset.id;
            let action = e.target.dataset.action;

            if (action === 'edit') {
                if (this.onEditNote !== null) {
                    this.onEditNote(id);
                }
            } else if (action === 'delete') {
                if (this.onDeleteNote !== null) {
                    this.onDeleteNote(id);
                }
            } else {
                console.log('Unknown action: ' + action);
            }
        });
    };
});