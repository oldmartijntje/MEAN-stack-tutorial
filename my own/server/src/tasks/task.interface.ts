import * as mongodb from "mongodb";

export interface TaksInterface {
    name: string;
    when: Date;
    done: boolean;
    description?: string;
    user?: mongodb.ObjectId | string;
    _id?: mongodb.ObjectId;
}