export default interface DAO<T> {
    tableName: string;
    create(object: T): Promise<string>;
    readOneById(id: string): Promise<T | null>;
    readManyIds(): Promise<Array<string> | null>;
    readLimitedById(first: number, count: number): Promise<Array<T> | null>;
    update(object: T): Promise<void>;
    delete(object: T): Promise<void>;
}
