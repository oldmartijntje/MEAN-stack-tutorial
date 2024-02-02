import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "../database";

export const taskRouter = express.Router();
taskRouter.use(express.json());

taskRouter.get("/", async (_req, res) => {
    try {
        const tasks = await collections.tasks.find({}).toArray();
        res.status(200).send(tasks);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

taskRouter.get("/filtered/:query", async (req, res) => {
    try {
        var query = JSON.parse(req?.params?.query);
        // const tasks = await collections.tasks.find({}).toArray();
        for (const key in query) {
            if (query[key] === '') {
                delete query[key];
            } else if (typeof query[key] === 'string') {
                query[key] = { $regex: query[key], $options: 'i' }
            }
        }
        const tasks = await collections.tasks.find(query).toArray();
        res.status(200).send(tasks);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

taskRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const task = await collections.tasks.findOne(query);

        if (task) {
            res.status(200).send(task);
        } else {
            res.status(404).send(`Failed to find an task: ID ${id}`);
        }

    } catch (error) {
        res.status(404).send(`Failed to find an task: ID ${req?.params?.id}`);
    }
});

taskRouter.post("/", async (req, res) => {
    try {
        const task = req.body;
        const result = await collections.tasks.insertOne(task);

        if (result.acknowledged) {
            res.status(201).send(`Created a new task: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new task.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

taskRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const task = req.body;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.tasks.updateOne(query, { $set: task });

        if (result && result.matchedCount) {
            res.status(200).send(`Updated an task: ID ${id}.`);
        } else if (!result.matchedCount) {
            res.status(404).send(`Failed to find an task: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update an task: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});

taskRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const result = await collections.tasks.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed an task: ID ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove an task: ID ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Failed to find an task: ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});