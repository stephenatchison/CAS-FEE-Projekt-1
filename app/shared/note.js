export class Note {
    constructor() {
        this.title = '';
        this.description = '';
        this.importance = 0;
        this.creationDate = new Date();
        this.dueDate = null;
        this.completionDate = null;

        if (arguments.length >= 1) {
            if (typeof arguments[0] === 'object') {
                this.__init(arguments[0]);
            } else if (typeof arguments[0] === 'string') {
                this.__initFromJSON(arguments[0]);
            }
        }
    }

    get completed() { return this.completionDate !== null; };

    toggleCompleted() {
        this.completionDate = this.completed ? null : new Date();
    };

    isValid() {
        return this.title.length > 0;
    }

    isSameAs(note) {

        let result = (note != null)
            && (note instanceof Note)
            && (this._id === note._id)
            && (this.title === note.title)
            && (this.description === note.description)
            && (this.importance === note.importance)
            && this.__compareDates(this.creationDate, note.creationDate)
            && this.__compareDates(this.dueDate, note.dueDate)
            && this.__compareDates(this.completionDate, note.completionDate);
        
        return result;
    };    

    __initFromJSON(json) {
        return this.__init(JSON.parse(json));
    };

    __init(obj) {
        if (obj.hasOwnProperty('_id')) {
            this._id = obj._id;
        }
        this.title = obj.title;
        this.description = obj.description;
        this.importance = obj.importance;
        this.creationDate = (obj.creationDate != null) ? new Date(obj.creationDate) : null;
        this.dueDate = (obj.dueDate != null) ? new Date(obj.dueDate) : null;
        this.completionDate = (obj.completionDate != null) ? new Date(obj.completionDate) : null;

        return this;
    };

    __compareDates(d1, d2) {
        let result;

        if ((d1 === null) || (d2 === null)) {
            if ((d1 === null) && (d2 === null)) {
                result = true;
            } else {
                result = false;
            }
        } else {
            result = d1.getTime() === d2.getTime();
        }

        return result;
    }
}