export class Note {
    constructor() {
        this.id = 0;
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

    isSameAs(note) {
        return (note != null)
            && (note instanceof Note)
            && (this.id === note.id)
            && (this.title === note.title)
            && (this.description === note.description)
            && (this.importance === note.importance)
            && (this.creationDate === note.creationDate)
            && (this.dueDate === note.dueDate)
            && (this.completionDate === note.completionDate);
    };

    __initFromJSON(json) {
        return this.__init(JSON.parse(json));
    };

    __init(obj) {
        this.id = obj.id;
        this.title = obj.title;
        this.description = obj.description;
        this.importance = obj.importance;
        this.creationDate = (obj.creationDate != null) ? new Date(obj.creationDate) : null;
        this.dueDate = (obj.dueDate != null) ? new Date(obj.dueDate) : null;
        this.completionDate = (obj.completionDate != null) ? new Date(obj.completionDate) : null;

        return this;
    };
}