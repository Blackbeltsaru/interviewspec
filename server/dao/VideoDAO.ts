import { Connection, FieldPacket, QueryError, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import EditStatus from "../types/EditStatus";
import { Video } from "../types/Video";
import DAO from "./dao";
import * as db from '../db';

type DBVIdeo = {
    video_id?: string
    title?: string,
    file_path?: string
};


//NOTE: Ideally the edit status filter would apply to all transactions, I would 
//need to learn more about the mysql2 library to implement that properly.
const VideoDAO: DAO<Video> = class {
    static tableName = 'videos';
    static async readOneById(id: string): Promise<Video | null> {
        const query = `SELECT * FROM ${this.tableName} WHERE video_id = ? AND 
                        NOT edit_status = ? LIMIT 1`;
        const values = [id, EditStatus.Hidden];
        const [videos] = await db.query<DBVIdeo[]>(query, values);
        if (videos.length < 1) return null;
        return {
            videoId: videos[0].video_id!,
            title: videos[0].title!,
            filePath: videos[0].file_path!
        };
    }

    static async readManyIds(): Promise<Array<string> | null> {
        const query = `SELECT video_id FROM ${this.tableName} WHERE
                        NOT edit_status = ?`;
        const values = [EditStatus.Hidden];
        const [idResults] = await db.query<DBVIdeo[]>(query, values);
        if (idResults.length < 1) return null;
        const ids: string[] = idResults
            .map((el)=>(el.video_id!));
        return ids;
    }

    static async readLimitedById(first: number, count: number): Promise<Array<Video> | null> {
        throw new Error("Method not implemented.");
    }

    static async update(object: Video): Promise<void> {
        throw new Error("Method not implemented.");
    }

    static async delete(object: Video): Promise<void> {
        throw new Error("Method not implemented.");
    }

    static async create(object: Video): Promise<string> {
        const query = `INSERT INTO ${VideoDAO.tableName} (title, file_path, edit_status)
                     VALUES (?, ?, ?)`;
        const values: Array<any> = [object.title, object.filePath, EditStatus.Editable];
        const [results] = await db.query<ResultSetHeader>(query, values);
        return results.insertId.toString();
    }
}

export default VideoDAO;