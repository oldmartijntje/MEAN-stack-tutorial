import * as mongodb from "mongodb";
import { TaskInterface } from "./tasks/task.interface";
import { userJsonSchema } from "./users/user.schema";
import { UserInterface } from "./users/user.interface";
import { taskJsonSchema } from "./tasks/task.schema";

export const collections: {
    // this has to be done for all collections that we want to have JSON schema validation on
    tasks?: mongodb.Collection<TaskInterface>;
    users?: mongodb.Collection<UserInterface>;
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);

    console.log("-Connecting to the database");
    await client.connect();
    console.log("-Connected to the database");

    const db = client.db("myMeanStackExample");
    console.log("-Database 'myMeanStackExample' selected");

    // This has to be done for all collections that we want to have JSON schema validation on
    // for tasks
    await applySchemaValidation(db, taskJsonSchema, "tasks");
    collections.tasks = db.collection<TaskInterface>("tasks");
    console.log("-Collection 'tasks' selected");

    // for tasks
    await applySchemaValidation(db, userJsonSchema, "users");
    collections.users = db.collection<UserInterface>("users");
    console.log("-Collection 'users' selected");
}

// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Employee model, even if added elsewhere.
// For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
async function applySchemaValidation(db: mongodb.Db, jsonSchema: any, collectionName = "invalidImplementation") {

    // Try applying the modification to the collection, if the collection doesn't exist, create it
    console.log(`-Applying schema validation to collection '${collectionName}'`);
    await db.command({
        collMod: collectionName
    }).catch(async (error: mongodb.MongoServerError) => {
        console.error(`-Error applying schema validation to collection '${collectionName}'`);
        if (error.codeName === 'NamespaceNotFound') {
            await db.createCollection(collectionName);
        }
    });
}