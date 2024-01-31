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
    await client.connect();

    const db = client.db("myMeanStackExample");

    // This has to be done for all collections that we want to have JSON schema validation on
    // for tasks
    await applySchemaValidation(db, taskJsonSchema, "tasks");
    collections.tasks = db.collection<TaskInterface>("tasks");

    // for tasks
    await applySchemaValidation(db, userJsonSchema, "users");
    collections.users = db.collection<UserInterface>("users");
}

// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Employee model, even if added elsewhere.
// For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
async function applySchemaValidation(db: mongodb.Db, jsonSchema: any, collectionName = "invalidImplementation") {

    // Try applying the modification to the collection, if the collection doesn't exist, create it
    await db.command({
        collMod: collectionName,
        validator: jsonSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === 'NamespaceNotFound') {
            await db.createCollection(collectionName, { validator: jsonSchema });
        }
    });
}