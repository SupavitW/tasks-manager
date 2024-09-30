import { Request, Response, NextFunction } from "express";
import Users_Utils from "../db/users/utils";
import { HttpError } from "../interfaces";

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await Users_Utils.getUsers();
        res.status(200).json(users);
        return;
    } catch(error) {
        next(error);
    }
};

export const deleteUser = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await Users_Utils.deleteUserById(id);

        res.status(204);
        return;
    } catch(error) {
        next(error);
    }
};

export const updateUser = async(req:Request, res: Response, next: NextFunction) => {
    try {
        const { username, role} = req.body;
        const { id } = req.params;
        
        if (!username || !role) {
            const inValidInput = new HttpError('Invalid Input', 400);
            throw inValidInput;
        }

        const updatingUser = await Users_Utils.getUserById(id);
        if(!updatingUser) {
            const noUser = new HttpError('No user found', 400);
            throw noUser;
        }

        updatingUser.username = username;
        updatingUser.role = role;

        await updatingUser.save();

        res.status(200).send(updatingUser);
        return;
    } catch(error) {
        next(error);
    }
}
