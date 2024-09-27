import mongoose, { Document, ObjectId } from "mongoose";

export interface Task extends Document {
    _id: ObjectId;
    title: string;
    description: string;
    status: 'To Do' | 'In Progress' | 'Done';
    priority: 'Low' | 'Medium' | 'High';
    user_id: mongoose.Schema.Types.ObjectId;
}

const TasksSchema = new mongoose.Schema({
    title: {type: String, require: true},
    description: {type: String, require: true},
    status: {status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' }, require: true},
    priority: {type: String, enum: ['Low', 'Medium', 'High'], require: true},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Users', require: true},
});

const TasksModel = mongoose.model<Task>('Tasks', TasksSchema);

export default TasksModel;