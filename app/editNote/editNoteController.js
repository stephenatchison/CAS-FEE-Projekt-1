import {Controller} from "../shared/controller";
import {EditNoteView} from "./editNoteView";
import {Note} from "../shared/note";
import {NoteView} from "../shared/noteView";

export class EditNoteController extends Controller {
    constructor(app) {
        super(app, 'editNote', EditNoteView);
        this.__note = null;
        this.__changedNote = null;
    }

    activate() {
        super.activate();

        let tokens = location.pathname.split('/');
        let idx = tokens.indexOf(this.name);
        let id;

        if ((idx >= 0) && (tokens.length > idx + 1)) {
            id = Number(tokens[tokens.length - 1]);
        } else {
            id = 0;
        }
        if (id === 0) {
            this.__note = null;
        } else {
            this.__note = this.noteService.loadNote(id);
        }
        this.__renderView();
        this.view.initAndFocusOnFirstField();
    };

    deactivate() {
        super.deactivate();
    };

    initView(view) {
        view.onCancel = () => {
            this.__gotoOverview();
        };

        view.onSubmit = (note) => {
            if (this.__note === null) {
                this.__note = new Note();
            }

            this.__updateChangedNote(note);
            this.noteService.saveNote(this.__changedNote);
            this.__gotoOverview();
        };

        view.onValidate = (note) => this.__getChangesCanBeSubmitted(note);
    }

    __renderView() {
        this.view.render(new NoteView(this.__note));
    }

    __gotoOverview() {
        this.navigateTo('', true);
    }

    __getChangesCanBeSubmitted(note) {
        this.__updateChangedNote(note);
        return this.__changedNote.isSameAs(this.__note) ? false : this.__changedNote.isValid();
    }

    __updateChangedNote(note) {
        if (this.__changedNote === null) {
            this.__changedNote = this.__note === null ? new Note() : new Note(this.__note);
        }

        this.__changedNote.title = note.title;
        this.__changedNote.description = note.description;
        this.__changedNote.importance = Number(note.importance);
        this.__changedNote.dueDate = new Date(note.dueDate);
    }
}