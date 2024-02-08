import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connectToDatabase } from "./database";
import { taskRouter } from "./tasks/task.routes";
import { userRouter } from "./users/user.routes";

// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();
console.log("-Successfully loaded environment variables");

const { ATLAS_URI } = process.env;
console.log("-ATLAS_URI:", ATLAS_URI);

if (!ATLAS_URI) {
    console.error("No ATLAS_URI environment variable has been defined in config.env");
    process.exit(1);
}
console.log("-ATLAS_URI is defined");

connectToDatabase(ATLAS_URI)
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