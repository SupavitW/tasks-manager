import TasksModel, { Task } from "./tasks";

// Utils functions for Tasks Model
export class Tasks_Utils {
    static getTasks = () => {
        return TasksModel.find().populate('user_id'); // populate the user_id to show user details relative to each task
    }

    static getTaskById = (id: Task['_id']) => {
        return TasksModel.findById(id).populate('user_id');
    }

    static getTasksByUser = (user_id: Task['user_id']) => {
        return TasksModel.find({user_id});
    }

    static getTasksByStatus = (status: Task['status']) => {
        return TasksModel.find({status}).populate('user_id');
    }
    
    static getTasksByPriority = (priority: Task['priority']) => {
        return TasksModel.find({priority}).populate('user_id');
    }
    
    static createTask = async (values: Omit<Task,'_id'>) => {
        const newTask = await new TasksModel(values).save();
        return newTask.toObject;
    } 

    static updateTask = async (values: Omit<Task, '_id'>) => {
        const updatedTask  = await TasksModel.findByIdAndUpdate(values);
        return updatedTask;
    }
}
