import {Controller} from "../shared/controller";
import {EditNoteView} from "./editNoteView";
import {Note} from "../model/note";
import {NoteView} from "../model/noteView";

export class EditNoteController extends Controller {
    constructor(app) {
        super(app, 'editNote', EditNoteView);
        this.__note = null;
        this.__changedNote = null;
    }

    async activate() {
        super.activate();

        let tokens = location.pathname.split('/');
        let idx = tokens.indexOf(this.name);
        let id;

        if ((idx >= 0) && (tokens.length > idx + 1)) {
            id = tokens[tokens.length - 1];
        } else {
            id = '';
        }

        this.__changedNote = null;
        if (id === '') {
            this.__note = null;
        } else {
            try {
                this.__note = await this.noteService.loadNote(id);
            }
            catch(e) {
              // note was not found
              this.__note = new Note();
              this.__note._id = id;
            }
        }

        this.__renderView();
    };

    deactivate() {
        super.deactivate();
    };

    initView(view) {
        view.onCancel = () => {
            this.__gotoOverview();
        };

        view.onSubmit = async (note) => {
            if (this.__note === null) {
                this.__note = new Note();
            }

            try {
                this.__updateChangedNote(note);
                await this.noteService.saveNote(this.__changedNote);
                this.__gotoOverview();
            }
            catch(e) {

            }
        };

        view.onValidate = (note) => this.__getChangesCanBeSubmitted(note);
    }

    __renderView() {
        this.view.render(new NoteView(this.__note));
        this.view.initAndFocusOnFirstField();
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