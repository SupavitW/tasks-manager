import request from 'supertest';
import server from '../../index'; // Assuming you have an Express server instance exported from server.ts
import Users_Utils from '../../services/userServices';
import { isAuthenticated, isManager, isOwner } from '../../middlewares';

jest.mock('../../services/userServices');
jest.mock('../../middlewares'); // Mock the auth middleware

// Mock implementation of the auth middleware to always call next()
(isAuthenticated as jest.Mock).mockImplementation((req, res, next) => next());
(isManager as jest.Mock).mockImplementation((req, res, next) => next());
(isOwner as jest.Mock).mockImplementation((req, res, next) => next());

describe('User Controller', () => {
    describe('getUsers', () => {
        it('should return a list of users', async () => {
            const mockUsers = [{ id: 1, username: 'JohnDoe', role: 'admin' }];
            (Users_Utils.getUsers as jest.Mock).mockResolvedValue(mockUsers);

            const response = await request(server).get('/users');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUsers);
        });

        it('should handle errors', async () => {
            (Users_Utils.getUsers as jest.Mock).mockRejectedValue(new Error('Database error'));

            const response = await request(server).get('/users');

            expect(response.status).toBe(500);
        });
    });

    describe('deleteUser', () => {
        it('should delete a user and return 204 status', async () => {
            (Users_Utils.deleteUserById as jest.Mock).mockResolvedValue(true);

            const response = await request(server).delete('/user/delete/1');

            expect(response.status).toBe(204);
        });

        it('should return 400 if user is not found', async () => {
            (Users_Utils.deleteUserById as jest.Mock).mockResolvedValue(null);

            const response = await request(server).delete('/user/delete/1');

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('No user found');
        });
    });

    // describe('updateUser', () => {
    //     it('should update a user and return the updated user', async () => {
    //         const mockUser = { id: 1, username: 'JohnDoe', role: 'admin', save: jest.fn() };
    //         (Users_Utils.getUserById as jest.Mock).mockResolvedValue(mockUser);

    //         const response = await request(server)
    //             .patch('/user/update/1')
    //             .send({ username: 'JaneDoe', role: 'user' });

    //         expect(response.status).toBe(200);
    //         expect(response.body.username).toBe('JaneDoe');
    //         expect(response.body.role).toBe('user');
    //     });

    //     it('should return 400 if input is invalid', async () => {
    //         const response = await request(server)
    //             .patch('/user/update/1')
    //             .send({ username: '', role: '' });

    //         expect(response.status).toBe(400);
    //         expect(response.body.message).toBe('Invalid Input');
    //     });

    //     it('should return 400 if user is not found', async () => {
    //         (Users_Utils.getUserById as jest.Mock).mockResolvedValue(null);

    //         const response = await request(server)
    //             .patch('/user/update/1')
    //             .send({ username: 'JaneDoe', role: 'user' });

    //         expect(response.status).toBe(400);
    //         expect(response.body.message).toBe('No user found');
    //     });

    //     it('should handle errors', async () => {
    //         (Users_Utils.getUserById as jest.Mock).mockRejectedValue(new Error('Database error'));

    //         const response = await request(server)
    //             .patch('/user/update/1')
    //             .send({ username: 'JaneDoe', role: 'user' });

    //         expect(response.status).toBe(500);
    //     });
    // });
});