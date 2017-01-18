// https://mertarauh.com/tutorials/typescript-design-patterns/bridge-pattern/

module Bridge {
    
    class Record {
        constructor(id: number, lastModified: Date = new Date()) {
            this.id = id;
            this.lastModified = lastModified;
        }

        private _id: number;
        public get id(): number {
            return this._id;
        }
        public set id(value: number) {
            this._id = value;
        }

        private _lastModified: Date;
        public get lastModified(): Date {
            return this._lastModified;
        }
        public set lastModified(value: Date) {
            this._lastModified = value;
        }

        public display() {
            console.log(this.id + ":" + this.lastModified);
        }
    }

    class ContactRecord extends Record {
        constructor(id: number, name: string, lastModified: Date = new Date()) {
            super(id, lastModified);
            this.name = name;
        }

        private _name: string;
        public get name(): string {
            return this._name;
        }

        public set name(value: string) {
            this._name = value;
        }

        public display() {
            console.log(this.id + ":" + this.name + ":" + this.lastModified);
        }
    }

    interface IRepository {
        create(item: T): T;
        read(id: number): T;

        exists(id: number): boolean;

        update(item: T): T;

        delete(id: number): void;
    }

    interface IContactRepository extends IRepository {
        readByName(name: string): Array;
    }

    class RecordBridge {
        constructor(public implementor: IRepository) {
        }

        public createOrUpdate(item: T): T {
            var exists = false;
            if (item.id) {
                exists = this.implementor.exists(item.id);
            }

            var retVal: T;
            if (exists) {
                retVal = this.implementor.update(item);
            } else {
                retVal = this.implementor.create(item);
            }

            return retVal;
        }

        read(id: number): T {
            return this.implementor.read(id);
        }

        delete(id: number): void {
            this.implementor.delete(id);
        }
    }

    class ContactBridge extends RecordBridge {
        constructor(public implementor: IContactRepository) {
            super(implementor);
        }

        public readByName(name: string) {
            return this.implementor.readByName(name);
        }
    }

    class TestRepository implements IRepository {
        protected records: Array = new Array();
        constructor() {
            this.records = <Array>[new Record(1),
                new Record(2),
                new Record(3)];
        }

        create(item: T): T {
            this.records.push(item);
            return item;
        }

        read(id: number): T {
            var i = this.records.length;
            while (i--) {
                var item = this.records[i];
                if (item.id === id) {
                    return item;
                }
            }

            return null;
        }

        exists(id: number): boolean {
            return this.records.some((item) => { return item.id === id; });
        }

        update(item: T): T {
            var existingItem = this.read(item.id);

            if (existingItem) {
                var index = this.records.indexOf(existingItem);
                this.records[index] = item;
            }

            return item;
        }

        delete(id: number): void {
            var item = this.read(id);
            if (item) {
                var index = this.records.indexOf(item);
                this.records.splice(index, 1);
            }
        }
    }

    class TestContactRepository extends TestRepository implements IContactRepository  {
        constructor() {
            super();
            this.records = <Array>[new ContactRecord(1, "Wesley"),
                new ContactRecord(2, "Norbert"),
                new ContactRecord(3, "Sridhar")];
        }

        readByName(name: string): Array {
            return this.records.filter((item) => { return item.name === name; });
        }
    }

    class ProductionRepository implements IRepository {
        protected records: Array = new Array();
        constructor() {
            this.records = <Array>[new Record(1),
                new Record(2),
                new Record(3)];
        }

        create(item: T): T {
            this.records.push(item);
            return item;
        }

        read(id: number): T {
            var i = this.records.length;
            while (i--) {
                var item = this.records[i];
                if (item.id === id) {
                    return item;
                }
            }

            return null;
        }

        exists(id: number): boolean {
            return this.records.some((item) => { return item.id === id; });
        }

        update(item: T): T {
            var existingItem = this.read(item.id);

            if (existingItem) {
                var index = this.records.indexOf(existingItem);
                this.records[index] = item;
            }

            return item;
        }

        delete(id: number): void {
            var item = this.read(id);
            if (item) {
                var index = this.records.indexOf(item);
                this.records.splice(index, 1);
            }
        }
    }

    class ProductionContactRepository extends ProductionRepository implements IContactRepository  {
        constructor() {
            super();
            this.records = <Array>[new ContactRecord(1, "Wesley"),
                new ContactRecord(2, "Norbert"),
                new ContactRecord(3, "Sridhar")];
        }

        readByName(name: string): Array {
            return this.records.filter((item) => { return item.name === name; });
        }
    }


    var test = true;
    var contactRepository: IContactRepository;

    if (test) {
        contactRepository = new TestContactRepository();
    } else {
        contactRepository = new ProductionContactRepository();
    }

    var recordBridge = new RecordBridge(contactRepository);
    var record = recordBridge.read(1);
    record.display();

    var contactBridge = new ContactBridge(contactRepository);
    var contact = contactBridge.readByName("Norbert")[0];
    contact.display();

    contact.name = "Norbert Cseffai";
    contactBridge.createOrUpdate(contact);

    contact.display();

}