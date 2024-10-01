import mongoose, { Date, Document, ObjectId } from "mongoose";
import { Task } from "../../interfaces";

const TasksSchema = new mongoose.Schema({
    title: {type: String, require: true},
    description: {type: String, require: true},
    status: {type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do', require: true},
    priority: {type: String, enum: ['Low', 'Medium', 'High'], require: true},
    due_date: {type: Date, require: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'Users', require: true},
});

const TasksModel = mongoose.model<Task>('Tasks', TasksSchema);

export default TasksModel;