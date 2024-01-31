export const taskJsonSchema = {
    $jsonSchema: {
        bsonType: "object",
        required: ["name", "when", "done"],
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
            when: {
                bsonType: "date",
                description: "'when' is required and is a date",
            },
            done: {
                bsonType: "boolean",
                description: "'done' is required and is a boolean",
            },
            description: {
                bsonType: "string",
                description: "'description' is an optional field and is a string",
            },
            user: {
                anyOf: [
                    {
                        bsonType: "objectId",
                        description: "'user' is an optional field and must be a valid ObjectId",
                    },
                    {
                        bsonType: "string",
                        description: "'user' is an optional field and must be a string",
                    },
                ],
            },
        },
    },
};
