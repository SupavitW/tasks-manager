import mongoose, { Document, ObjectId } from "mongoose";


// Define Users interface
export interface UsersDocument extends Document {
    _id: ObjectId;
    username: string;
    role: 'Team Member'|'Manager';
    authentication: {
        password: string;
        sessionToken: string;
    };
};

// Task interface
export interface Task extends Document {
    _id: ObjectId;
    title: string;
    description: string;
    status: 'To Do' | 'In Progress' | 'Done';
    priority: 'Low' | 'Medium' | 'High';
    due_date: Date
    user_id: mongoose.Schema.Types.ObjectId;
}


export class HttpError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message); // Call the Error constructor with the message
        this.status = status; // Add the status property
        this.name = this.constructor.name; // Optional: name the error class
        Error.captureStackTrace(this, this.constructor); // Optional: capture stack trace
    }
}