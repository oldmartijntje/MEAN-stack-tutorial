import { Schema } from "mongoose";

export const taskJsonSchema = {
    name: {
        type: String,
        required: true,
        description: "'name' is required and is a string",
    },
    when: {
        type: Date,
        required: true,
        description: "'when' is required and is a date",
    },
    done: {
        type: Boolean,
        required: true,
        description: "'done' is required and is a boolean",
    },
    description: {
        type: String,
        description: "'description' is an optional field and is a string",
    },
    user: {
        type: Schema.Types.ObjectId,
        description: "'user' is an optional field and must be a valid ObjectId",
    },
};