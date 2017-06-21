import {Controller} from "../shared/controller";
import {EditNoteView} from "./editNoteView";
import {Note} from "../shared/note";
import {NoteView} from "../shared/noteView";

export class EditNoteController extends Controller {
    constructor(app) {
        super(app, 'editNote', EditNoteView);
        this.__note = null;
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

            this.__note.title = note.title;
            this.__note.description = note.description;
            this.__note.importance = Number(note.importance);
            this.__note.dueDate = new Date(note.dueDate);

            this.noteService.saveNote(this.__note);
            this.__gotoOverview();
        };
    }

    __renderView() {
        this.view.render(new NoteView(this.__note));
    }

    __gotoOverview() {
        this.navigateTo('', true);
    }
}