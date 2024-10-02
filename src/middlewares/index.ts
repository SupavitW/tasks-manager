import { Request, Response, NextFunction } from 'express'
import Users_Utils from '../services/userServices';
import { get, merge } from 'lodash';
import { HttpError } from '../interfaces';
import * as dotev from 'dotenv';
import jwt from 'jsonwebtoken';
import user from '../router/user';
dotev.config();

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessionToken = req.cookies['Task_Manager_Auth'];

        // No token
        if (!sessionToken) {
            const noCredential = new HttpError('No valid credential', 403);
            throw noCredential;
        }

        // Check jwt credential
        const decoded_user = jwt.verify(sessionToken, process.env.SECRET as string);
        if (!decoded_user) {
            throw new HttpError('Invalid jwt token', 400);
        }

        // Find the user in db via token 
        const foundUser = await Users_Utils.getUserBySessionToken(sessionToken);
        if (!foundUser) {
            throw new HttpError('The user is no longer valid in the database', 400);
        }

        // Attach user identity to the request
        merge(req, { identity: decoded_user });
        next();

    } catch (error) {
        next(error);
    }
};

export const isOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params; 
        const userId = get(req, 'identity.user_id');

        if (!userId) {
            throw new HttpError('Invalid session', 400);
        }
        
        if(userId != id)  {
            throw new HttpError('Forbidden', 403);
        }

        next();
        
    } catch(error) {
        next(error);
    }
}

export const isManager = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userRole = get(req, 'identity.user_role') as any as string;

        if (!userRole) {
            throw new HttpError('Invalid session', 400);
        }

        if (userRole != 'Manager') {
            throw new HttpError('Forbidden', 403);
        }

        next();

    } catch (error) {
        next(error);
    }
};