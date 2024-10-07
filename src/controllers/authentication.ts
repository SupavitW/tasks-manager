import { Request, Response, NextFunction } from 'express';
import User_Utils from '../services/userServices';
import { comparePasswords, passwordHash } from '../helpers';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv'
import { HttpError } from '../interfaces';
dotenv.config()

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password || !role) {
            res.status(400).send('Invalid Input');
            return;
        }

        if (role !== 'Team Member' && role !== 'Manager') {
            res.status(400).send('Invalid role input');
            return;
        }

        const existingUser = await User_Utils.getUserByUsername(username);

        if (existingUser) {
            res.status(400).send('User is already existed');
            return
        }

        // Storing user's info to database
        const hashedPassword = await passwordHash(password, 10);
        const newUser = await User_Utils.createUser({
            username,
            role,
            authentication: {
                password: hashedPassword
            }
        });
        res.status(201).json(newUser).end()

    } catch (error) {
        next()
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).send('Invalid Input');
            return
        }

        const user = await User_Utils.getUserByUsername(username).select('+authentication.password');

        if (!user) {
            res.status(400).send('No user found');
            return
        }

        // Compare Password
        if (!await comparePasswords(password, user.authentication.password)) {
            const wrongPassword = new HttpError('Wrong Password', 401);
            throw wrongPassword
        }

        // Create JWT Token
        const user_id = user._id;
        const user_role = user.role;
        const secret = process.env.SECRET || 'DEFAULT_SECRET';
        const token = jwt.sign({ username, user_id, user_role }, secret, { expiresIn: '30m' });

        user.authentication.sessionToken = token;
        await user.save();

        res.status(200).cookie('Task_Manager_Auth', user.authentication.sessionToken).json(user);

    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.Task_Manager_Auth
        if (!token) {
            res.status(204).send();;
            return;
        }
        res.status(200).clearCookie('Task_Manager_Auth').json({ "msg": "Logout Successfully" });
        return;
    } catch (error) {
        next(error);
    }
}