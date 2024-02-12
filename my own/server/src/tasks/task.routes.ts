import * as express from "express";
import * as mongodb from "mongodb";
import { collections, tasks } from "../database";

export const taskRouter = express.Router();
taskRouter.use(express.json());

taskRouter.get("/", async (_req, res) => {
    try {
        const foundTasks = await tasks.find({});
        res.status(200).send(foundTasks);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

taskRouter.get("/filtered/:query", async (req, res) => {
    try {
        var query = JSON.parse(req?.params?.query);
        // const tasks = await tasks.find({});
        for (const key in query) {
            if (query[key] == '') {
                delete query[key];
            } else if (key == 'when') {
                const startDate = new Date(query['when']);
                const endDate = new Date(query['untillWhen']);
                query[key] = {
                    $gte: startDate,
                    $lt: endDate,
                }
                delete query['untillWhen'];
            } else if (key == 'user') {
                if (query[key] == ' ') {
                    query[key] = undefined;
                } else {
                    query[key] = new mongodb.ObjectId(query[key]);
                }
            } else if (typeof query[key] === 'string') {
                query[key] = { $regex: query[key], $options: 'i' }
            }
        }
        const foundTasks = await tasks.find(query);
        res.status(200).send(foundTasks);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

taskRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const task = await tasks.find(query);

        if (task) {
            res.status(200).send(task[0]);
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
        if (task.user == ' ') {
            task.user = undefined;
        } else {
            task.user = new mongodb.ObjectId(task.user);
        }
        const newTask = new tasks(task);
        const result = await newTask.save()
        if (result) {
            res.status(201).send(`Created a new task: ID ${result._id}.`);
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
        if (task.user == ' ') {
            task.user = undefined;
        } else {
            task.user = new mongodb.ObjectId(task.user);
        }
        const newTask = new tasks(task);
        newTask._id = new mongodb.ObjectId(id);
        const result = await tasks.replaceOne({ _id: new mongodb.ObjectId(id) }, newTask)
        if (result) {
            res.status(201).send(`Updated a task: ID ${id}.`);
        } else {
            res.status(500).send("Failed to update a task.");
        }

        // if (result && result.matchedCount) {
        //     res.status(200).send(`Updated an task: ID ${id}.`);
        // } else if (!result.matchedCount) {
        //     res.status(404).send(`Failed to find an task: ID ${id}`);
        // } else {
        //     res.status(304).send(`Failed to update an task: ID ${id}`);
        // }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});

taskRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const result = await tasks.findByIdAndDelete(id);

        if (result) {
            res.status(201).send(`Deleted a  task: ID ${id}.`);
        } else {
            res.status(500).send("Failed to delete a task.");
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});