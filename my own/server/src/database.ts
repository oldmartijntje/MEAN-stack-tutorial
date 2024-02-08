import * as mongodb from "mongodb";
import mongoose, { Document, Schema } from "mongoose";
import { TaskInterface } from "./tasks/task.interface";
import { userJsonSchema } from "./users/user.schema";
import { UserInterface } from "./users/user.interface";
import { taskJsonSchema } from "./tasks/task.schema";

// This has to be done for all collections that we want to have JSON schema validation on
const taskSchema = new mongoose.Schema(taskJsonSchema);
export const tasks = mongoose.model('task', taskSchema);

const userSchema = new mongoose.Schema(userJsonSchema);
export const users = mongoose.model('user', userSchema);

export const collections: {
    // this has to be done for all collections that we want to have JSON schema validation on
    tasks?: mongodb.Collection<TaskInterface>;
    users?: mongodb.Collection<UserInterface>;
} = {};

export async function connectToDatabase(uri: string) {
    const mongoose = require('mongoose');
    await mongoose.connect(uri);


    const henk = new users({ name: 'henk', accessLevel: 1 });
    console.log(henk.name);
    console.log(henk.accessLevel);
    // henk.save()
}