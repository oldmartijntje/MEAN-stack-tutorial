import * as mongodb from "mongodb";

export interface UserInterface {
    name: string;
    accessLevel: string;
    _id?: mongodb.ObjectId;
}