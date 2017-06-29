import {Note} from "./note";

export class NoteService {
    constructor() {
        this.__lastLoadAllResult = null;
        this.__idPrefix = 'note_';
    }

    loadAllNotes(hitServer) {
        return hitServer ? this.__loadAllNotes(true) : new Promise((resolve, reject) => { resolve(this.__lastLoadAllResult); });
    }

    getChangesAvailable() {
        return new Promise((resolve, reject) => {
            if (this.__detectIfChangesAvailable()) {
                resolve();
            } else {
                reject();
            }
        });
    }

    loadNote(id) {
        return new Promise((resolve, reject) => {
            let strJson = localStorage.getItem(this.__getId(id));
            resolve((strJson != null) ? new Note(strJson) : null);
        });
    }

    saveNote(note) {
        return new Promise((resolve, reject) => {
            if (note != null) {
                if (note.id === 0) {
                    note.id = this.__getNextId();
                }
                this.__saveNoteToLocalStorage(note);
            }
            resolve(note);
        });
    }

    deleteNote(id) {
        return new Promise((resolve, reject) => {
            this.loadNote(id).then(note => {
                if (n != null) {
                    this.__removeNoteFromLocalStorage(n);
                    resolve();
                } else {
                    reject();
                }
            })
            .catch(() => { reject(); });
        });
    }

    __loadAllNotes(keepResult) {
        // load all notes from localStorage
        let notes = [];
        let key, strJson;

        for(let i = 0, ii = localStorage.length; i < ii; i++) {
            key = localStorage.key(i);
            if (key.startsWith(this.__idPrefix)) {
                strJson = localStorage.getItem(key);
                notes.push(new Note(strJson));
            }
        }

        if (keepResult) {
            this.__lastLoadAllResult = notes.slice();
            this.__lastLoadAllResult.sort((a, b) => a.id - b.id);
        }

        return notes;
    }

    __getNextId() {
        let notes = this.__loadAllNotes(true);
        return (notes.length === 0) ? 1 : (notes.map(e => e.id).sort((a, b) => b - a))[0] + 1;
    }

    __detectIfChangesAvailable() {
        let notes = this.__loadAllNotes(false);
        notes.sort((a, b) => a.id - b.id);

        if (this.__lastLoadAllResult === null) {
            this.__lastLoadAllResult = notes;
            return true;
        }

        if (notes.length !== this.__lastLoadAllResult.length) {
            this.__lastLoadAllResult = notes;
            return true;
        }

        for(let i = 0, ii = notes.length; i < ii; i++) {
            if (!notes[i].isSameAs(this.__lastLoadAllResult[i])) {
                this.__lastLoadAllResult = notes;
                return true;
            }
        }

        return false;
    }

    __getId(id) {
        return this.__idPrefix + id;
    }

    __saveNoteToLocalStorage(note) {
        localStorage.setItem(this.__getId(note.id), JSON.stringify(note));
    }

    __removeNoteFromLocalStorage(note) {
        localStorage.removeItem(this.__getId(note.id));
    }
}