import { ErrorableResponse } from "typedefs";

export default interface Repository<T> {
    create(object: T): Promise<ErrorableResponse<string>>;
    readOneById(id: string): Promise<ErrorableResponse<T>>;
    readManyIds(): Promise<ErrorableResponse<Array<string>>>;
    readLimitedIds(first: number, count: number): Promise<ErrorableResponse<Array<string>>>;
    update(object: T): Promise<ErrorableResponse<void>>;
    delete(object: T): Promise<ErrorableResponse<void>>;
}