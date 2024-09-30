import mongoose from 'mongoose';
import { UsersDocument } from '../../interfaces';

// Define Users Schema
const UsersSchema = new mongoose.Schema({
    username: {type: String, require: true},
    role: {type: String, enum: ['Team Member', 'Manager'], default: 'Team Member', require: true },
    authentication: {
        password: {type: String, require: true, select: false},
        sessionToken: {type: String, select: false},
    }
});

const UsersModel = mongoose.model<UsersDocument>('Users', UsersSchema); 

export default UsersModel;


``




