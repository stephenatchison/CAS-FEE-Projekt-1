import {Note} from "./note";

export class NoteRESTClientService {
    constructor(baseUrl) {
        this.__baseUrl = baseUrl + 'api/';
        this.__lastLoadAllResult = null;
    }

    loadAllNotes(hitServer) {
        return hitServer ? this.__loadAllNotes(true) : new Promise((resolve, reject) => { resolve(this.__lastLoadAllResult.slice()); });
    }

    getChangesAvailable() {
        return this.__detectIfChangesAvailable();
    }

    loadNote(id) {
        return new Promise((resolve, reject) => {
            this.__sendRequest('GET', 'notes/' + id)
                .then((record) => { resolve(new Note(record)); })
                .catch((error) => { reject(error); });
        });
    }

    saveNote(note) {
        return new Promise((resolve, reject) => {
            let method, path;

            if (note.hasOwnProperty('_id')) {
                method = 'PUT';
                path = 'notes/' + note._id;
            } else {
                method = 'POST';
                path = 'notes';
            }

            this.__sendRequest(method, path, note)
                .then((record) => { resolve((record != null) ? new Note(record) : record); })
                .catch((error) => { reject(error); });
        });
    }

    deleteNote(id) {
        return this.__sendRequest('DELETE', 'notes/' + id);
    }

    __loadAllNotes(keepResult) {
        return new Promise((resolve, reject) => {
            this.__sendRequest('GET', 'notes')
                .then((records) =>{
                    let notes = records.map(r => new Note(r));
                    if (keepResult) {
                        this.__lastLoadAllResult = notes.slice();
                        this.__lastLoadAllResult.sort((a, b) => (a > b) - (a < b));
                    }
                    resolve(notes);
                })
                .catch((error) => {
                    reject();
                });
        });
    }

    __detectIfChangesAvailable() {
        return new Promise((resolve, reject) => {
            this.__loadAllNotes(false)
                .then((notes) => {
                    let changesDetected = false;
                    notes.sort((a, b) => (a > b) - (a < b));
                    if (this.__lastLoadAllResult === null) {
                        changesDetected = true;
                    }

                    if (notes.length !== this.__lastLoadAllResult.length) {
                        changesDetected = true;
                    }

                    for(let i = 0, ii = notes.length; i < ii; i++) {
                        if (!notes[i].isSameAs(this.__lastLoadAllResult[i])) {
                            changesDetected = true;
                            break;
                        }
                    }

                    if (changesDetected) {
                        this.__lastLoadAllResult = notes;
                        resolve();
                    } else {
                        reject();
                    }
                })
                .catch(() => {
                    reject();
                });
        });
    }

    __sendRequest(method, path, data) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();

            xhr.onload = () => {
                if ((xhr.status >= 200) && (xhr.status < 300)) {
                    let data = null;
                    if ((typeof xhr.responseText === 'string') && (xhr.responseText.length > 1)) {
                        data = JSON.parse(xhr.responseText);
                    }
                    resolve(data);
                } else {
                    reject(xhr);
                }
            };
            xhr.onerror = () => {
                reject(xhr);
            }

            xhr.open(method, this.__baseUrl + path, true);
            if (data) {
                xhr.setRequestHeader('Content-Type', 'application/json');
            }
            xhr.send(JSON.stringify(data));
        });
    }
}