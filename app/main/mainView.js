window.noteApp.addView('main', function() {
    this.viewName = 'mainView';

    var that = this;
    var $notesElem = null;

    function findArticle(elem) {
        if (elem === null) {
            return null;
        } else if (elem.tagName === 'ARTICLE') {
            return elem;
        } else {
            return findArticle(elem.parentElement);
        }
    }

    function handleCompletionEvent(e) {
        let article = findArticle(e.currentTarget);
        if (article != null) {
            let id = Number(article.dataset.id);
            if (that.onNoteCompletedChange !== null) {
                that.onNoteCompletedChange(id, e.currentTarget.value);
            }
        } else {
            console.log('No article found!');
        }
    }

    function handleButtonEvent(e) {
        let article = findArticle(e.currentTarget);
        if (article != null) {
            let id = Number(article.dataset.id);
            let action = e.currentTarget.dataset.action;

            if (action === 'edit') {
                if (that.onEditNote !== null) {
                    that.onEditNote(id);
                }
            } else if (action === 'delete') {
                if (that.onDeleteNote !== null) {
                    that.onDeleteNote(id);
                }
            } else {
                console.log('Unknown action: ' + action);
            }
        } else {
            console.log('No article found!');
        }
    }

    function addEventHandlers(elem) {
        $notesElem = $('#notes', elem);
        if ($notesElem != null) {
            $notesElem.on('click', 'button', handleButtonEvent);
            $notesElem.on('change', 'input:checkbox', handleCompletionEvent);
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