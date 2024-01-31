export const userJsonSchema = {
    $jsonSchema: {
        bsonType: "object",
        required: ["name", "accessLevel"],
        additionalProperties: false,
        properties: {
            _id: {
                bsonType: "objectId",
                description: "'_id' is an optional field and must be a valid ObjectId",
            },
            name: {
                bsonType: "string",
                description: "'name' is required and is a string",
            },
            accessLevel: {
                bsonType: "string",
                description: "'accessLevel' is required and is a string",
            },
        },
    },
};
