import { Connection, FieldPacket, QueryError, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { VideoEntity, EditStatus } from "typedefs";
import DAO from "./dao";
import * as db from '../db';

//NOTE: Ideally the edit status filter would apply to all transactions, I would 
//need to learn more about the mysql2 library to implement that properly.
const VideoDAO: DAO<VideoEntity> = class {
    static tableName = 'videos';
    static async readOneById(id: string): Promise<VideoEntity | null> {
        const query = `SELECT * FROM ${this.tableName} WHERE video_id = ? AND 
                        NOT edit_status = ? LIMIT 1`;
        const values = [id, EditStatus.Hidden];
        const [videos] = await db.query<VideoEntity[]>(query, values);
        if (videos.length < 1) return null;
        return videos[0];
    }

    static async readManyIds(): Promise<Array<string> | null> {
        const query = `SELECT video_id FROM ${this.tableName} WHERE
                        NOT edit_status = ?`;
        const values = [EditStatus.Hidden];
        const [idResults] = await db.query<VideoEntity[]>(query, values);
        if (idResults.length < 1) return null;
        const ids: string[] = idResults
            .map((el)=>(el.video_id!));
        return ids;
    }

    static async readLimitedIds(first: number, count: number): Promise<Array<string> | null> {
        throw new Error("Method not implemented.");
    }

    static async update(object: VideoEntity): Promise<void> {
        throw new Error("Method not implemented.");
    }

    static async delete(object: VideoEntity): Promise<void> {
        throw new Error("Method not implemented.");
    }

    static async create(object: VideoEntity): Promise<string> {
        const query = `INSERT INTO ${VideoDAO.tableName} (title, file_path, edit_status)
                     VALUES (?, ?, ?)`;
        const values: Array<any> = [object.title, object.file_path, EditStatus.Editable];
        const [results] = await db.query<ResultSetHeader>(query, values);
        return results.insertId.toString();
    }
}

export default VideoDAO;