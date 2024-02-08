import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connectToDatabase } from "./database";
import { taskRouter } from "./tasks/task.routes";
import { userRouter } from "./users/user.routes";

// Load environment variables from the .env file, where the MONGO_URI is configured
dotenv.config();
console.log("-Successfully loaded environment variables");

const { MONGO_URI } = process.env;
console.log("-MONGO_URI:", MONGO_URI);

if (!MONGO_URI) {
    console.error("No MONGO_URI environment variable has been defined in config.env");
    process.exit(1);
}
console.log("-MONGO_URI is defined");

connectToDatabase(MONGO_URI)
    .then(() => {
        const app = express();
        console.log("-Connected to the database");
        app.use(cors());
        console.log("-CORS enabled");

        app.use("/tasks", taskRouter);
        console.log("-Task routes enabled");
        app.use("/users", userRouter);
        console.log("-User routes enabled");
        // start the Express server
        app.listen(5200, () => {
            console.log(`Server running at http://localhost:5200...`);
        });

    })
    .catch(error => console.error(error));