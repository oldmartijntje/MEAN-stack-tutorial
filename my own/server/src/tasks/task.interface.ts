import * as mongodb from "mongodb";

export interface TaksInterface {
    name: string;
    when: Date;
    done: boolean;
    description?: string;
    person: string;
    _id?: mongodb.ObjectId;
}