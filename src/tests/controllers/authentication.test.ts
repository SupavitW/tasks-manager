import request from 'supertest';
import server from '../../index'; 
import Users_Utils from '../../services/userServices';
import { comparePasswords, passwordHash} from '../../helpers';
import jwt from 'jsonwebtoken';

jest.mock('../../services/userServices');
jest.mock('../../helpers');
jest.mock('jsonwebtoken');

describe('Authentication Controller', () => {
    afterEach(() => {
        server.close();
    });

   describe('register', () => {
        it('should create a new user', async () => {
            (Users_Utils.getUserByUsername as jest.Mock).mockResolvedValue(null);
            (passwordHash as jest.Mock).mockResolvedValue('hashedpassword');
            (Users_Utils.createUser as jest.Mock).mockResolvedValue({ username: 'JohnDoe', role: 'Team Member' });

            const response = await request(server)
                .post('/auth/register')
                .send({ username: 'JohnDoe', password: 'password', role: 'Team Member' });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('username');
        });

        it('should return 400 if user already exists', async () => {
            (Users_Utils.getUserByUsername as jest.Mock).mockResolvedValue({ username: 'JohnDoe', role: 'Team Member' });

            const response = await request(server)
                .post('/auth/register')
                .send({ username: 'JohnDoe', password: 'password', role: 'Team Member' });

            expect(response.status).toBe(400);
        });

        it('should return 400 if input is invalid', async () => {
            const response = await request(server)
                .post('/auth/register')
                .send({ username: 'JohnDoe', role: 'Team Member' });

            expect(response.status).toBe(400);
        });
    });

    describe('login', () => {

        it('should return 400 if user is not found', async () => {
            (Users_Utils.getUserByUsername as jest.Mock).mockReturnValue({
                select: jest.fn().mockReturnValue(null)
            });

            const response = await request(server)
                .post('/auth/login')
                .send({ username: 'JohnDoe', password: 'password' });

            expect(response.status).toBe(400);
        });

        it('should return 400 if input is invalid', async () => {
            const response = await request(server)
                .post('/auth/login')
                .send({ username: 'JohnDoe' });

            expect(response.status).toBe(400);
        });

        it('should return 401 if password is incorrect', async () => {
            (Users_Utils.getUserByUsername as jest.Mock).mockReturnValue({
                select: jest.fn().mockReturnValue({ username: 'JohnDoe', role: 'Team Member', authentication: { password: 'password' } })
            });
            (comparePasswords as jest.Mock).mockResolvedValue(false);

            const response = await request(server)
                .post('/auth/login')
                .send({ username: 'JohnDoe', password: 'password' });

            expect(response.status).toBe(401);
        });

        it('should return a token if user is found', async () => {
            const mockUser = { username: 'JohnDoe', role: 'Team Member', authentication: { password: 'password' }, save: jest.fn().mockResolvedValue(true)};
            const mockToken = 'mockToken';
            (Users_Utils.getUserByUsername as jest.Mock).mockReturnValue({
                select: jest.fn().mockReturnValue(mockUser)
            });
            (comparePasswords as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue(mockToken);

            const response = await request(server)
                .post('/auth/login')
                .send({ username: 'JohnDoe', password: 'password' });

            expect(response.status).toBe(200);
            expect(mockUser.save).toHaveBeenCalled();
            expect(response.body.username).toBe(mockUser.username);
            expect(response.body.authentication.sessionToken).toBe(mockToken);
        });
    });

    
    describe('logout', () => {
        it('should return 204 if no token is found', async () => {
            const response = await request(server)
                .get('/auth/logout');

            expect(response.status).toBe(204);
        });

        it('should return 200 and clear the cookie if token is found', async () => {
            const response = await request(server)
                .get('/auth/logout')
                .set('Cookie', 'Task_Manager_Auth=validToken');

            expect(response.status).toBe(200);
            expect(response.body.msg).toBe('Logout Successfully');
            expect(response.headers['set-cookie'][0]).toMatch(/Task_Manager_Auth=;/);
        });
    });
});