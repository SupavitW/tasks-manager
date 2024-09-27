import mongoose, {Document, ObjectId} from 'mongoose';

// Define Users interface
export interface UsersDocument extends Document {
    _id: ObjectId;
    username: string;
    authentication: {
        password: string;
        sessionToken: string;
    };
};

// Define Users Schema
const UsersSchema = new mongoose.Schema({
    username: {type: String, require: true},
    authentication: {
        password: {type: String, require: true, select: false},
        sessionToken: {type: String, select: false},
    }
});

const UsersModel = mongoose.model<UsersDocument>('Users', UsersSchema); 

export default UsersModel;







