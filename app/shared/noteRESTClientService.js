import {Note} from "./note";

export class NoteRESTClientService {
    constructor(baseUrl) {
        this.__baseUrl = baseUrl + 'api/';
        this.__lastLoadAllResult = null;
    }

    loadAllNotes(hitServer) {
        return hitServer ? this.__loadAllNotes(true) : new Promise((resolve, reject) => { resolve(this.__lastLoadAllResult); });
    }

    getChangesAvailable() {
        return this.__detectIfChangesAvailable();
    }

    loadNote(id) {
        return this.__sendRequest('GET', 'notes/' + id);
    }

    saveNote(note) {
        let method, path;

        if (note.hasOwnProperty('_id')) {
            method = 'PUT';
            path = 'notes/' + _id;
        } else {
            method = 'POST';
            path = 'notes';
        }

        return this.__sendRequest(method, path, note);
    }

    deleteNote(id) {
        return this.__sendRequest('DELETE', 'notes/' + id);
    }

    __loadAllNotes(keepResult) {
        return new Promise((resolve, reject) => {
            this.__sendRequest('GET', 'notes')
                .then((notes) =>{
                    if (keepResult) {
                        this.__lastLoadAllResult = notes.slice();
                        this.__lastLoadAllResult.sort((a, b) => a._id - b._id);
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
                .then(notes => {
                    let changesDetected = false;

                    notes.sort((a, b) => a._id - b._id);

                    if (this.__lastLoadAllResult === null) {
                        this.__lastLoadAllResult = notes;
                        changesDetected = true;
                    }

                    if (notes.length !== this.__lastLoadAllResult.length) {
                        this.__lastLoadAllResult = notes;
                        changesDetected = true;
                    }

                    for(let i = 0, ii = notes.length; i < ii; i++) {
                        if (!notes[i].isSameAs(this.__lastLoadAllResult[i])) {
                            this.__lastLoadAllResult = notes;
                            changesDetected = true;
                            break;
                        }
                    }

                    if (changesDetected) {
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
                    resolve(JSON.parse(xhr.responseText), xhr);
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