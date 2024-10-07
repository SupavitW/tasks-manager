import request from 'supertest';
import server from '../../index'; 
import Tasks_Utils from '../../services/taskServices';
import Users_Utils from '../../services/userServices';
import { isAuthenticated, isManager, isOwner } from '../../middlewares';


jest.mock('../../services/taskServices');
jest.mock('../../services/userServices');
jest.mock('../../middlewares'); // Mock the auth middleware

// Mock implementation of the auth middleware to always call next
(isAuthenticated as jest.Mock).mockImplementation((req, res, next) => next());
(isManager as jest.Mock).mockImplementation((req, res, next) => next());
(isOwner as jest.Mock).mockImplementation((req, res, next) => next());

describe('Task Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
        server.close();
    });

    describe('createTask', () => {
        it('should create a task and return 201 status', async () => {
            const mockTask = { id: 1, title: 'Task 1', description: 'Description', status: 'To Do', priority: 'Low', due_date: '2021-10-10', username: 'JohnDoe' };
            (Tasks_Utils.createTask as jest.Mock).mockResolvedValue(mockTask);
            (Users_Utils.getUserByUsername as jest.Mock).mockResolvedValue({ _id: 1 });

            const response = await request(server).post('/createTask').send(mockTask);

            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockTask);
        });

        it('should return 400 if user is not found', async () => {
            (Tasks_Utils.createTask as jest.Mock).mockResolvedValue(null);

            const response = await request(server).post('/createTask');

            expect(response.status).toBe(400);
       });

        it('should handle errors', async () => {
            const mockTask = { id: 1, title: 'Task 1', description: 'Description', status: 'To Do', priority: 'Low', due_date: '2021-10-10', username: 'JohnDoe' };
            (Tasks_Utils.createTask as jest.Mock).mockRejectedValue(new Error('Database error'));
            (Users_Utils.getUserByUsername as jest.Mock).mockResolvedValue({ _id: 1 });

            const response = await request(server).post('/createTask').send(mockTask);

            expect(response.status).toBe(500);
        });
    });

    describe('getTasks', () => {
        it('should return a list of tasks', async () => {
            const mockTasks = [{ id: 1, title: 'Task 1', description: 'Description', status: 'To Do', priority: 'Low', due_date: '2021-10-10', user: 1 }];
            (Tasks_Utils.getTasks as jest.Mock).mockReturnValue({
                lean: jest.fn().mockReturnValue(mockTasks)
            });;

            const response = await request(server).get('/getTasks');
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockTasks);
            
        });
    
        it('should handle errors', async () => {
            (Tasks_Utils.getTasks as jest.Mock).mockReturnValue({
                lean: jest.fn().mockReturnValue(new Error('Database error'))
            });
    
            const response = await request(server).get('/getTasks');
    
            expect(response.status).toBe(500);
        });
    });

    describe('getTaskById', () => {
        it('should return a task by ID', async () => {
            const mockTask = { id: 1, title: 'Task 1', description: 'Description', status: 'To Do', priority: 'Low', due_date: '2021-10-10', user: 1 };
            (Tasks_Utils.getTaskById as jest.Mock).mockReturnValue({
                lean: jest.fn().mockReturnValue(mockTask)
            });

            const response = await request(server).get('/getTaskById/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockTask);
        });

        it('should return 400 if task is not found', async () => {
            (Tasks_Utils.getTaskById as jest.Mock).mockReturnValue({
                lean: jest.fn().mockReturnValue(null)
            });

            const response = await request(server).get('/getTaskById/1');

            expect(response.status).toBe(400);
        });

        it('should handle errors', async () => {
            (Tasks_Utils.getTaskById as jest.Mock).mockResolvedValue({
                lean: jest.fn().mockRejectedValue(new Error('Database error'))
            });

            const response = await request(server).get('/getTaskById/1');

            expect(response.status).toBe(500);
        });
    });

    describe('getTasksByDate', () => {
        it('should return a list of tasks sorted by date', async () => {
            const mockTasks = [{ id: 1, title: 'Task 1', description: 'Description', status: 'To Do', priority: 'Low', due_date: '2021-10-10', user: 1 }];
            (Tasks_Utils.getTasksByDate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockReturnValue(mockTasks)
            });

            const response = await request(server).get('/getTasksByDate');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockTasks);
        });

        it('should handle errors', async () => {
            (Tasks_Utils.getTasksByDate as jest.Mock).mockReturnValue({
                lean: jest.fn().mockRejectedValue(new Error('Database error'))
            });

            const response = await request(server).get('/getTasksByDate');

            expect(response.status).toBe(500);
        });
    });

    describe('getTasksByUser', () => {
        it('should return a list of tasks by user', async () => {
            const mockTasks = [{ id: 1, title: 'Task 1', description: 'Description', status: 'To Do', priority: 'Low', due_date: '2021-10-10', user: 1 }];
            (Tasks_Utils.getTasksByUser as jest.Mock).mockReturnValue({
                lean: jest.fn().mockReturnValue(mockTasks)
            });

            const response = await request(server).get('/getTasksByUser/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockTasks);
        });

        it('should handle errors', async () => {
            (Tasks_Utils.getTasksByUser as jest.Mock).mockReturnValue({
                lean: jest.fn().mockRejectedValue(new Error('Database error'))
            });

            const response = await request(server).get('/getTasksByUser/1');

            expect(response.status).toBe(500);
        });
    });

    describe('getTasksByStatus', () => {
        it('should return a list of tasks by status', async () => {
            const mockTasks = [{ id: 1, title: 'Task 1', description: 'Description', status: 'To Do', priority: 'Low', due_date: '2021-10-10', user: 1 }];
            (Tasks_Utils.getTasksByStatus as jest.Mock).mockReturnValue({
                lean: jest.fn().mockReturnValue(mockTasks)
            });

            const response = await request(server).get('/getTasksByStatus').query({ status: 'To Do' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockTasks);
        });

        it('should handle errors', async () => {
            (Tasks_Utils.getTasksByStatus as jest.Mock).mockReturnValue({
                lean: jest.fn().mockRejectedValue(new Error('Database error'))
            });

            const response = await request(server).get('/getTasksByStatus').query({ status: 'To Do' });;

            expect(response.status).toBe(500);
        });
    });

    describe('getTasksByPriority', () => {
        it('should return a list of tasks by priority', async () => {
            const mockTasks = [{ id: 1, title: 'Task 1', description: 'Description', status: 'To Do', priority: 'Low', due_date: '2021-10-10', user: 1 }];
            (Tasks_Utils.getTasksByPriority as jest.Mock).mockReturnValue({
                lean: jest.fn().mockReturnValue(mockTasks)
            });

            const response = await request(server).get('/getTasksByPriority').query({ priority: 'Low' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockTasks);
        });

        it('should handle errors', async () => {
            (Tasks_Utils.getTasksByPriority as jest.Mock).mockReturnValue({
                lean: jest.fn().mockRejectedValue(new Error('Database error'))
            });

            const response = await request(server).get('/getTasksByPriority').query({ priority: 'Low' });

            expect(response.status).toBe(500);
        })
    });

    describe('updateTask', () => {
        it('should update a task and return the updated task', async () => {
            const mockTask = { id: 1, title: 'Task 1', description: 'Description', status: 'To Do', priority: 'Low', due_date: '2021-10-10', user: 1 };
            (Tasks_Utils.updateTask as jest.Mock).mockReturnValue(mockTask);

            const response = await request(server).put('/updateTask/1').send(mockTask);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockTask);
        });

        it('should return 400 if task is not found', async () => {
            (Tasks_Utils.updateTask as jest.Mock).mockReturnValue({
                lean: jest.fn().mockReturnValue(null)
            });

            const response = await request(server).put('/updateTask/1');

            expect(response.status).toBe(400);
        });

        it('should handle errors', async () => {
            const mockTask = { id: 1, title: 'Task 1', description: 'Description', status: 'To Do', priority: 'Low', due_date: '2021-10-10', user: 1 };
            (Tasks_Utils.updateTask as jest.Mock).mockRejectedValue({
                lean: jest.fn().mockRejectedValue(new Error('Database error'))
            });
            (Users_Utils.getUserByUsername as jest.Mock).mockResolvedValue({ _id: 1 });

            const response = await request(server).put('/updateTask/1').send(mockTask);

            expect(response.status).toBe(500);
        });
    });
});