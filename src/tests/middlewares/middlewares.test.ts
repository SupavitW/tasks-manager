import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
    identity?: any;
}
import { isAuthenticated, isOwner, isManager } from '../../middlewares';
import Users_Utils from '../../services/userServices';
import jwt from 'jsonwebtoken';
import { HttpError } from '../../interfaces';


jest.mock('../../services/userServices');
jest.mock('jsonwebtoken');

describe('Middlewares', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(async () => {
        req = {
            cookies: {},
            params: {},
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }
        next = jest.fn();
    });
    
    // await isAuthenticated(req as AuthenticatedRequest, res as Response, next);

    describe('isAuthenticated', () => {
        it('should throw error if no session token', async () => {
            await isAuthenticated(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(new HttpError('No valid credential', 403));
        });

        it('should throw error if invalid jwt token', async () => {
            req.cookies = req.cookies || {};
            req.cookies['Task_Manager_Auth'] = 'invalidToken';
            (jwt.verify as jest.Mock).mockImplementation(() => { throw new HttpError('Invalid jwt token', 400) });

            await isAuthenticated(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(new HttpError('Invalid jwt token', 400));
        });

        it('should throw error if user not found in db', async () => {
            req.cookies = req.cookies || {};
            req.cookies['Task_Manager_Auth'] = 'validToken';
            (jwt.verify as jest.Mock).mockReturnValue({ user_id: '123' });
            (Users_Utils.getUserBySessionToken as jest.Mock).mockResolvedValue(null);

            await isAuthenticated(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(new HttpError('The user is no longer valid in the database', 400));
        });

        it('should call next if user is authenticated', async () => {
            req.cookies = req.cookies || {};
            req.cookies['Task_Manager_Auth'] = 'validToken';
            const decodedUser = { user_id: '123' };
            (jwt.verify as jest.Mock).mockReturnValue(decodedUser);
            (Users_Utils.getUserBySessionToken as jest.Mock).mockResolvedValue({});

            await isAuthenticated(req as Request, res as Response, next);
            expect(next).toHaveBeenCalled();
            expect((req as AuthenticatedRequest).identity).toEqual(decodedUser);
        });
    });

    describe('isOwner', () => {
        it('should throw error if invalid session', async () => {
            req.params = req.params || {};
            req.params.id = '123';
            await isOwner(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(new HttpError('Invalid session', 400));
        });

        it('should throw error if user is not the owner', async () => {
            req.params = req.params || {};
            req.params.id = '123';
            (req as AuthenticatedRequest).identity = { user_id: '456' };
            await isOwner(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(new HttpError('Forbidden', 403));
        });

        it('should call next if user is the owner', async () => {
            req.params = req.params || {};
            req.params.id = '123';
            (req as AuthenticatedRequest).identity = { user_id: '123' };
            await isOwner(req as Request, res as Response, next);
            expect(next).toHaveBeenCalled();
        });
    });

    describe('isManager', () => {
        it('should throw error if invalid session', async () => {
            await isManager(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(new HttpError('Invalid session', 400));
        });

        it('should throw error if user is not a manager', async () => {
            (req as AuthenticatedRequest).identity = { user_role: 'User' };
            await isManager(req as Request, res as Response, next);
            expect(next).toHaveBeenCalledWith(new HttpError('Forbidden', 403));
        });

        it('should call next if user is a manager', async () => {
            (req as AuthenticatedRequest).identity = { user_role: 'Manager' };
            await isManager(req as Request, res as Response, next);
            expect(next).toHaveBeenCalled();
        });
    });
});
