import TasksModel from "./tasks";
import { Task } from "../../interfaces";

// Utils functions for Tasks Model
export class Tasks_Utils {
    static getTasks = () => {
        return TasksModel.find().populate('user'); // populate the user_id to show user details relative to each task
    }

    static getTaskById = (id: Task['_id']) => { 
        return TasksModel.findById(id).populate('user');
    }

    static getTasksByUser = (user_id: Task['user_id']) => {
        return TasksModel.find({user: user_id}).populate('user');
    }

    static getTasksByStatus = (status: Task['status']) => { 
        return TasksModel.find({status}).populate('user');
    }
    
    static getTasksByPriority = (priority: Task['priority']) => { 
        return TasksModel.find({priority}).populate('user');
    }
    
    static createTask = async (values: Record<string, any>) => {
        const newTask = await new TasksModel(values).save();
        return newTask;
    } 

    static updateTask = async (id: number, values: Record<string, any>) => { 
        const updatedTask  = await TasksModel.findByIdAndUpdate(id, values, { new: true });
        return updatedTask;
    }
}
