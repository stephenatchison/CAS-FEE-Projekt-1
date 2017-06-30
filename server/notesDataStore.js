module.exports = class NotesDataStore {
    init(dirName) {
        var path = require('path');
        var datastore = require('nedb');
        this.__notes = new datastore({ filename: path.join(dirName, 'notes.db'), autoload: true });
    }

    loadAll(onSuccess, onError) {
        this.__notes.find({}, this.__handleDataCallback.bind(this, onSuccess, onError));
    }

    load(id, onSuccess, onError) {
        this.__notes.findOne({ _id: id }, this.__handleDataCallback.bind(this, onSuccess, onError));
    }

    delete(id, onSuccess, onError) {
        this.__notes.remove({ _id: id}, this.__handleCountCallback.bind(this, onSuccess, onError));
    }

    add(note, onSuccess, onError) {
        this.__notes.insert(note, this.__handleDataCallback.bind(this, onSuccess, onError));
    }

    update(note, onSuccess, onError) {
        this.__notes.update({ _id: note._id }, note, this.__handleCountCallback.bind(this, onSuccess, onError));
    }
    
    __handleDataCallback(onSuccess, onError, error, data) {
        if (error) {
            onError(error);
        } else {
            onSuccess(data);
        }
    }
    
    __handleCountCallback(onSuccess, onError, error, count) {
        if (error) {
            onError(error);
        } else {
            onSuccess(count);
        }
    }
}