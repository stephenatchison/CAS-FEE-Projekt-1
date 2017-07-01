import {Note} from "../model/note";

export class NoteRESTClientService {
    constructor(baseUrl) {
        this.__baseUrl = baseUrl + 'api/';
        this.__lastTimestamp = 0;
    }

    loadAllNotes() {
        return new Promise((resolve, reject) => {
            this.__sendRequest('GET', 'notes')
                .then((data) => {
                    this.__lastTimestamp = data.version;
                    resolve(data.notes.map(r => new Note(r)));
                })
                .catch((error) => { reject(error); });
        });
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

    getChangesAvailable() {
        return new Promise((resolve, reject) => {
            this.__loadTimestamp()
                .then((ts) => {
                    if (ts > this.__lastTimestamp) {
                        this.__lastTimestamp = ts;
                        resolve();
                    } else {
                        reject();
                    }
                })
                .catch(() => { reject() });
            });
    }

    __loadTimestamp() {
        return new Promise((resolve, reject) => {
            this.__sendRequest('GET', 'notes?version')
                .then((record) => {
                    resolve(record.version);
                })
                .catch((error) => {
                    reject(error);
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