import * as express from "express";
import * as mongodb from "mongodb";
import { collections, users } from "../database";

export const userRouter = express.Router();
userRouter.use(express.json());

userRouter.get("/", async (_req, res) => {
    try {
        const foundUsers = await users.find({});
        res.status(200).send(foundUsers);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

userRouter.get("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new mongodb.ObjectId(id) };
        const user = await users.find(query);

        if (user) {
            res.status(200).send(user[0]);
        } else {
            res.status(404).send(`Failed to find an user: ID ${id}`);
        }

    } catch (error) {
        res.status(404).send(`Failed to find an user: ID ${req?.params?.id}`);
    }
});

userRouter.post("/", async (req, res) => {
    try {
        const user = req.body;
        const newUser = new users(user);
        const result = await newUser.save()
        if (result) {
            res.status(201).send(`Created a new user: ID ${result._id}.`);
        } else {
            res.status(500).send("Failed to create a new user.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

userRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const user = req.body;
        const newUser = new users(user);
        newUser._id = new mongodb.ObjectId(id);
        const result = await users.replaceOne({ _id: new mongodb.ObjectId(id) }, newUser)
        if (result) {
            res.status(201).send(`Updated a user: ID ${id}.`);
        } else {
            res.status(500).send("Failed to update a user.");
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});

userRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const result = await users.findByIdAndDelete(id);

        if (result) {
            res.status(201).send(`Deleted a  user: ID ${id}.`);
        } else {
            res.status(500).send("Failed to delete a user.");
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});