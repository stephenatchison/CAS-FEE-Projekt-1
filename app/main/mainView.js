window.noteApp.addView('main', function() {
    this.viewName = 'mainView';

    var that = this;
    var $notesElem = null;
    var $addNewElem = null;
    var $byDueDateElem = null;
    var $byCreationDateElem = null;
    var $byImportanceElem = null;
    var $showCompletedElem = null;

    function setActive($elem, isActive) {
        if ($elem != null) {
            if (isActive) {
                $elem.addClass('active');
            } else {
                $elem.removeClass('active');
            }
        }
    }

    function findRequiredElements(elem) {
        $notesElem = $('#notes', elem);
        $addNewElem = $('#addNew', elem);
        $byDueDateElem = $('#byDueDate', elem);
        $byCreationDateElem = $('#byCreationDate', elem);
        $byImportanceElem = $('#byImportance', elem);
        $showCompletedElem = $('#showCompleted', elem);
    }

    function findArticle(elem) {
        if (elem === null) {
            return null;
        } else if (elem.tagName === 'ARTICLE') {
            return elem;
        } else {
            return findArticle(elem.parentElement);
        }
    }

    function handleSetSortOrder(sortOrder) {
        if (that.onSortOrderChange != null) {
            that.onSortOrderChange(sortOrder);
        }
    }

    function handleShowCompletedEvent() {
        if (that.onShowCompletedChange != null) {
            that.onShowCompletedChange();
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
                    if (that.app.window().confirm('Willst Du dieser Eintrag wirklich löschen?')) {
                        that.onDeleteNote(id);
                    }
                }
            } else {
                console.log('Unknown action: ' + action);
            }
        } else {
            console.log('No article found!');
        }
    }

    function addSortHandler($elem, sortOrder, rootElem) {
        if ($elem != null) {
            $elem.on('click', handleSetSortOrder.bind(that, sortOrder));
        }
    }

    function removeSortHandler($elem) {
        if ($elem != null) {
            $elem.off('click');
        }
    }

    function addEventHandlers() {
        if ($notesElem != null) {
            $notesElem.on('click', 'button', handleButtonEvent);
            $notesElem.on('change', 'input:checkbox', handleCompletionEvent);
        }

        if ($addNewElem != null) {
            $addNewElem.on('click', function() {
                if (that.onAddNewNote != null) {
                    that.onAddNewNote();
                }
            })
        }

        addSortHandler($byDueDateElem, 1);
        addSortHandler($byCreationDateElem, 2);
        addSortHandler($byImportanceElem, 3);

        if ($showCompletedElem != null) {
            $showCompletedElem.on('click', handleShowCompletedEvent);
        }
    }


    function removeEventHandlers() {
        if ($notesElem != null) {
            $notesElem.off('click');
            $notesElem = null;
        }

        removeSortHandler($byDueDateElem);
        removeSortHandler($byCreationDateElem);
        removeSortHandler($byImportanceElem);

        if ($showCompletedElem != null) {
            $showCompletedElem.off('click');
        }
    }

    this.onAddNewNote = null;
    this.onEditNote = null;
    this.onDeleteNote = null;
    this.onNoteCompletedChange = null;
    this.onSortOrderChange = null;
    this.onShowCompletedChange = null;

    this.setSortOrder = function(sortOrder) {
        setActive($byDueDateElem, sortOrder === 1);
        setActive($byCreationDateElem, sortOrder === 2);
        setActive($byImportanceElem, sortOrder === 3);
    };

    this.setShowCompleted = function(flag) {
        setActive($showCompletedElem, flag);
    };

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
        findRequiredElements(elem);
        addEventHandlers();
    };
});