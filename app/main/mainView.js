import {View} from "../shared/view";

export class MainView extends View {
    constructor() {
        super('mainView', true);

        this.onAddNewNote = null;
        this.onEditNote = null;
        this.onDeleteNote = null;
        this.onNoteCompletedChange = null;
        this.onSortOrderChange = null;
        this.onShowCompletedChange = null;
        this.onAutoRefreshChange = null;

        this.__$notesElem = null;
        this.__$addNewElem = null;
        this.__$byDueDateElem = null;
        this.__$byCreationDateElem = null;
        this.__$byImportanceElem = null;
        this.__$showCompletedElem = null;
        this.__$autoRefreshElem = null;
    }

    deactivate() {
        this.__removeEventHandlers();
        super.deactivate();
    }

    render(data) {
        this.__removeEventHandlers();

        let elem = super.render(data);

        this.__findRequiredElements(elem);
        this.__addEventHandlers();
    }

    setSortOrder(sortOrder) {
        this.__setActive(this.__$byDueDateElem, sortOrder === 1);
        this.__setActive(this.__$byCreationDateElem, sortOrder === 2);
        this.__setActive(this.__$byImportanceElem, sortOrder === 3);
    };

    setShowCompleted(flag) {
        this.__setActive(this.__$showCompletedElem, flag);
    };

    __setActive($elem, isActive) {
        if ($elem != null) {
            if (isActive) {
                $elem.addClass('active');
            } else {
                $elem.removeClass('active');
            }
        }
    }

    __findRequiredElements(elem) {
        this.__$notesElem = $('#notes', elem);
        this.__$addNewElem = $('#addNew', elem);
        this.__$byDueDateElem = $('#byDueDate', elem);
        this.__$byCreationDateElem = $('#byCreationDate', elem);
        this.__$byImportanceElem = $('#byImportance', elem);
        this.__$showCompletedElem = $('#showCompleted', elem);
        this.__$autoRefreshElem = $('#autoRefresh', elem);
    }

    __findArticle(elem) {
        if (elem === null) {
            return null;
        } else if (elem.tagName === 'ARTICLE') {
            return elem;
        } else {
            return this.__findArticle(elem.parentElement);
        }
    }

    __handleSetSortOrder(sortOrder) {
        if (this.onSortOrderChange != null) {
            this.onSortOrderChange(sortOrder);
        }
    }

    __handleShowCompletedEvent() {
        if (this.onShowCompletedChange != null) {
            this.onShowCompletedChange();
        }
    }

    __handleToggleAutoRefreshEvent() {
        if (this.onAutoRefreshChange != null) {
            this.onAutoRefreshChange();
        }
    }

    __handleCompletionEvent(e) {
        let article = this.__findArticle(e.currentTarget);
        if (article != null) {
            let id = article.dataset.id;
            if (this.onNoteCompletedChange !== null) {
                this.onNoteCompletedChange(id, e.currentTarget.value);
            }
        } else {
            console.log('No article found!');
        }
    }

    __handleButtonEvent(e) {
        let article = this.__findArticle(e.currentTarget);
        if (article != null) {
            let id = article.dataset.id;
            let action = e.currentTarget.dataset.action;

            if (action === 'edit') {
                if (this.onEditNote !== null) {
                    this.onEditNote(id);
                }
            } else if (action === 'delete') {
                if (this.onDeleteNote !== null) {
                    if (confirm('Willst Du dieser Eintrag wirklich löschen?')) {
                        this.onDeleteNote(id);
                    }
                }
            } else {
                console.log('Unknown action: ' + action);
            }
        } else {
            console.log('No article found!');
        }
    }

    __addSortHandler($elem, sortOrder, rootElem) {
        if ($elem != null) {
            $elem.on('click', this.__handleSetSortOrder.bind(this, sortOrder));
        }
    }

    __removeSortHandler($elem) {
        if ($elem != null) {
            $elem.off('click');
        }
    }

    __addEventHandlers() {
        if (this.__$notesElem != null) {
            this.__$notesElem.on('click', 'button', this.__handleButtonEvent.bind(this));
            this.__$notesElem.on('change', 'input:checkbox', this.__handleCompletionEvent.bind(this));
        }

        if (this.__$addNewElem != null) {
            this.__$addNewElem.on('click', (function() {
                if (this.onAddNewNote != null) {
                    this.onAddNewNote();
                }
            }).bind(this));
        }

        this.__addSortHandler(this.__$byDueDateElem, 1);
        this.__addSortHandler(this.__$byCreationDateElem, 2);
        this.__addSortHandler(this.__$byImportanceElem, 3);

        if (this.__$showCompletedElem != null) {
            this.__$showCompletedElem.on('click', this.__handleShowCompletedEvent.bind(this));
        }

        if (this.__$autoRefreshElem != null) {
            this.__$autoRefreshElem.on('click', this.__handleToggleAutoRefreshEvent.bind(this));
        }
    }


    __removeEventHandlers() {
        if (this.__$notesElem != null) {
            this.__$notesElem.off('click');
            this.__$notesElem = null;
        }

        this.__removeSortHandler(this.__$byDueDateElem);
        this.__removeSortHandler(this.__$byCreationDateElem);
        this.__removeSortHandler(this.__$byImportanceElem);

        if (this.__$showCompletedElem != null) {
            this.__$showCompletedElem.off('click');
        }

        if (this.__$autoRefreshElem != null) {
            this.__$autoRefreshElem.off('click');
        }
    }
}