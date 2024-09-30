import UsersModel from "./users";

// Utils functions for Users Model
export default class Users_Utils {

    static getUsers = () => {
        return UsersModel.find();
    }

    static getUserById = (id: string) => {
        return UsersModel.findById(id);
    }

    static getUserBySessionToken = (sessionToken: string) => {
        return UsersModel.findOne({'authentication.sessionToken': sessionToken});
    }

    static getUserByUsername = (username: string) => {
        return UsersModel.findOne({username});
    }

    static createUser = async (values: Record<string, any>) => {
        const newUser = await new UsersModel(values).save();
        return newUser.toObject();
    };

    static deleteUserById = async(id: string) => {
        const deletedUser = await UsersModel.findByIdAndDelete(id);
        return deletedUser;
    }

    static updateUserById = async(id:number, values: Record<string, any>) => {
        const updatedUser = await UsersModel.findByIdAndUpdate(id, values);
        return updatedUser;
    }
};

