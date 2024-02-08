export const userJsonSchema = {
    name: {
        type: String,
        required: true,
        description: "'name' is required and is a string",
    },
    accessLevel: {
        type: String,
        required: true,
        description: "'accessLevel' is required and is a string",
    },
};