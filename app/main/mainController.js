import {Controller} from "../shared/controller";
import {MainView} from "./mainView";
import {NoteView} from "../shared/noteView";

export class MainController extends Controller {
    constructor(app) {
        super(app, 'main', MainView);

        this.__notes = [];
        this.__visibleNotes = [];
        this.__intervalId = null;
        this.__sortedNotes;
    }

    activate() {
        super.activate();
        this.__renderView(true, true);

        if (this.config.autoRefresh) {
            this.__startAutoRefresh();
        }
    };

    deactivate() {
        if (this.config.autoRefresh) {
            this.__stopAutoRefresh();
        }
    
        super.deactivate();
    };

    initView(view) {
        view.onRefresh = () => {
            this.__renderView(true, true);
        };

        view.onAddNewNote = () => {
            this.navigateTo('editNote', true);
        };

        view.onEditNote = id => {
            let note = this.__notes.find(n => n._id === id);
            if (note != null) {
                this.navigateTo('editNote/' + id, true);
            }
        };

        view.onDeleteNote = async id => {
            try {
                await this.noteService.deleteNote(id);
                this.__renderView(true, true);
            }
            catch(e) {
                console.log(e);
            }
        };

        view.onNoteCompletedChange = async (id, completed) => {
            let note = this.__notes.find(n => n._id === id);
            if (note != null) {
                note.toggleCompleted();
                try {
                    await this.noteService.saveNote(note);
                    this.__renderView(false, true);
                }
                catch(e) {

                }
            }
        };

        view.onSortOrderChange = sortOrder => {
            if (this.config.sortOrder !== sortOrder) {
                this.config.sortOrder = sortOrder;
                this.__renderView(false, false);
            }
        }

        view.onShowCompletedChange = () => {
            this.config.showCompleted = !this.config.showCompleted;
            this.__renderView(false, true);
        }

        view.onAutoRefreshChange = () => {
            this.config.autoRefresh = !this.config.autoRefresh;
            if (this.config.autoRefresh) {
                this.__startAutoRefresh();
            } else {
                this.__stopAutoRefresh();
            }

            this.__renderView(false, false);
        }
    }

    __compareDates(d1, d2) {
        if ((d1 === null) || (d2 === null)) {
            if ((d1 === null) && (d2 === null)) {
                return 0;
            } else if (d1 === null) {
                return 1;
            } else {
                return -1;
            }
        } else {
            return d1 - d2;
        }
    }

    __compareNotesByDueDate(a, b) {
        let val = this.__compareDates(a.dueDate, b.dueDate);
        if (val === 0) {
            val = b.importance - a.importance;
        }
        return val;
    }

    __compareNotesByCreationDate(a, b) {
        let val = this.__compareDates(a.creationDate, b.creationDate);
        if (val === 0) {
            val = b.importance - a.importance;
        }
        return val;
    }

    __compareNotesByImportance(a, b) {
        let val = b.importance - a.importance;
        if (val === 0) {
            val = a.dueDate - b.dueDate;
        }
        return val;
    }

    __sortNotes() {
        // determine the compare function to use for sorting the notes
        let compareFunc = null;
        switch(this.config.sortOrder) {
            case 1:
                compareFunc = this.__compareNotesByDueDate;
                break;
            case 2:
                compareFunc = this.__compareNotesByCreationDate;
                break;
            case 3:
                compareFunc = this.__compareNotesByImportance;
                break;
            default:
                throw 'Unknown sort order!';
        }

        // sort the notes
        this.__visibleNotes.sort(compareFunc.bind(this));
    }

    __filterNotes() {
        if (this.config.showCompleted) {
            this.__visibleNotes = this.__notes;
        } else {
            this.__visibleNotes = this.__notes.filter(note => !note.completed); 
        }
    }

    async __renderView(load, filter, hitServer = true) {
        try {
            if (load) {
                this.__notes = await this.noteService.loadAllNotes(hitServer);
            }

            if (filter) {
                this.__filterNotes();
            }

            this.__sortNotes();

            this.view.render({
                notes: this.__visibleNotes.map((note, idx) => new NoteView(note, idx + 1)),
                noNotes: this.__notes.length === 0,
                noneVisible: this.__visibleNotes.length === 0,
                autoRefresh: this.config.autoRefresh,
                showCompleted: this.config.showCompleted,
                sortByDueDate: this.config.sortOrder === 1,
                sortByCreationDate: this.config.sortOrder === 2,
                sortByImportance: this.config.sortOrder === 3,
            });
        }
        catch(e) {

        }
    }

    __startAutoRefresh() {
        this.__intervalId = setInterval(this.__refreshIfChangesDetected.bind(this), 1000);
    }

    __stopAutoRefresh() {
        clearInterval(this.__intervalId);
    }

    __refreshIfChangesDetected() {
        this.noteService.getChangesAvailable().then(() => { this.__renderView(true, true, false); }).catch(() => {});
    }
}