window.noteApp.addView('main', function() {
    this.viewName = 'mainView';

    var that = this;
    var $notesElem = null;

    function handleNoteEvent(e) {

    }

    function handleButtonEvent(e) {
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
    }

    function addEventHandlers(elem) {
        $notesElem = $('#notes', elem);
        if ($notesElem != null) {
            $notesElem.on('click', 'button', handleButtonEvent);
        }
    }


    function removeEventHandlers() {
        if ($notesElem != null) {
            $notesElem.off('click', handleButtonEvent)
            $notesElem = null;
        }
    }

    this.onEditNote = null;
    this.onDeleteNote = null;
    this.onNoteCompletedChange = null;

    // this.afterActivating = function() {
    // };

    // this.beforeDeactivating = function() {
    // };

    this.onDestroy = function() {
        removeEventHandlers();
    }

    this.beforeRendering = function(elem) {
        removeEventHandlers();
    }

    this.afterRendering = function(elem) {
        addEventHandlers(elem);
    };
});