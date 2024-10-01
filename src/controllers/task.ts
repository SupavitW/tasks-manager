import { Request, Response, NextFunction } from "express";
import { Tasks_Utils } from "../db/tasks/utils";
import { HttpError } from "../interfaces";
import Users_Utils from "../db/users/utils";
import { ObjectId } from "mongoose";

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, status, priority, due_date, username } = req.body;
        const user = await Users_Utils.getUserByUsername(username);

        if (!user) {
            throw new HttpError('Cannot find user', 400);
        }

        if (!title || !description || !status || !priority || !due_date) {
            const invalidInput = new HttpError('Invalid Input', 400);
            throw invalidInput;
        }

        // Allowed status options
        const allowedStatuses = ['To Do', 'In Progress', 'Done'];

        // Validate status
        if (!allowedStatuses.includes(status)) {
            throw new HttpError('Invalid Input: Status must be one of To Do, In Progress, Done', 400);
        }

        const allowedPriorities = ['Low', 'Medium', 'High'];

        if (!allowedPriorities.includes(priority)) {
            throw new HttpError('Invalid Input: Priority must be one of Low, Medium, High', 400);
        }

        const parsedDate = new Date(due_date); // parsed the due_date from req.body to JavaScript Date object
        const newTask = await Tasks_Utils.createTask({
            title,
            description,
            status,
            priority,
            due_date: parsedDate,
            user: user._id
        });
        res.status(201).send(newTask);
        return;
    } catch (error) {
        next(error);
    }
};

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tasks = await Tasks_Utils.getTasks();

        res.status(200).send(tasks);
        return;
    } catch (error) {
        next(error);
    }
}

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await Tasks_Utils.getTaskById(req.params.task_id as unknown as ObjectId);
        res.status(200).send(task);
        return;
    } catch (error) {
        next(error);
    }
}

export const getTasksByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await Tasks_Utils.getTasksByUser(req.params.user_id as unknown as ObjectId);
        res.status(200).send(task);
        return;
    } catch (error) {
        next(error);
    }
}

export const getTasksByStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Allowed status options
        const allowedStatuses = ['To Do', 'In Progress', 'Done'];

        // Get status from query
        const { status } = req.query;

        // Validate status (check if it exists and is valid)
        if (typeof status !== 'string' || !allowedStatuses.includes(status)) {
            throw new HttpError('Invalid Input: Status must be one of To Do, In Progress, Done', 400);
        }

        // Fetch tasks based on status
        const tasks = await Tasks_Utils.getTasksByStatus(status as any);
        res.status(200).send(tasks);
        return;
    } catch (error) {
        next(error);
    }
};


export const getTasksByPriority = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Check user inputs 
        const allowedPriorities = ['Low', 'Medium', 'High'];

        const { priority } = req.query;

        if (typeof priority !== 'string') {
            throw new HttpError('Invalid Input: Priority must be string', 400);
        }

        if (!(priority === 'Low' || priority === 'Medium' || priority === 'High')) {
            throw new HttpError('Invalid Input: Priority must be one of Low, Medium, High', 400);
        }
        
        const tasks = await Tasks_Utils.getTasksByPriority(priority);
        res.status(200).send(tasks);
        return;
    } catch (error) {
        next(error);
    }
}

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, status, priority, due_date, username } = req.body;

        const user = await Users_Utils.getUserByUsername(username);

        if (!user) {
            throw new HttpError('Cannot find user', 400);
        }

        if (!title || !description || !status || !priority || !due_date) {
            const invalidInput = new HttpError('Invalid Input', 400);
            throw invalidInput;
        }

        // Allowed status options
        const allowedStatuses = ['To Do', 'In Progress', 'Done'];

        // Validate status
        if (!allowedStatuses.includes(status)) {
            throw new HttpError('Invalid Input: Status must be one of To Do, In Progress, Done', 400);
        }

        const allowedPriorities = ['Low', 'Medium', 'High'];

        if (!allowedPriorities.includes(priority)) {
            throw new HttpError('Invalid Input: Priority must be one of Low, Medium, High', 400);
        }

        const parsedDate = new Date(due_date); // parsed the due_date from req.body to JavaScript Date object
        const updatedTask = await Tasks_Utils.updateTask(req.params.task_id as any, {
            title,
            description,
            status,
            priority,
            due_date: parsedDate,
            user: user._id
        });
        console.log(updatedTask);
        res.status(200).send(updatedTask);
        return;
    } catch (error) {
        next(error);
    }
}