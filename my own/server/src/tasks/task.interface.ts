import * as mongodb from "mongodb";

export interface TaskInterface {
    name: string;
    when: Date;
    done: boolean;
    description?: string;
    user?: mongodb.ObjectId | string;
    _id?: mongodb.ObjectId;
}