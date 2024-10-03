import { Task } from "../../interfaces";
import TaskModel from "../../db/tasks/tasks";
import Task_Utils from "../../services/taskServices";

// Mock the TaskModel
jest.mock("../../db/tasks/tasks");

describe('Task_Utils', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getTasks', () => {
        it('should return all tasks in database', async () => {
            const mockTasks: Task[] = [{ title: 'task1' }, { title: 'task2' }] as Task[];
            TaskModel.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockTasks)
            });

            const tasks = await Task_Utils.getTasks();
            expect(tasks).toEqual(mockTasks);
        });

        it('should return null if database is empty', async () => {
            TaskModel.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(null)
            });

            const tasks = await Task_Utils.getTasks();
            expect(tasks).toBeNull();
        });
    });

    describe('getTasksByDate', () => {
        it('should return tasks sorted by ascending due date', async () => {
            const mockTasksSorted: Task[] = [
                { title: 'task1', due_date: new Date('2023-01-01') },
                { title: 'task2', due_date: new Date('2023-01-02') }
            ] as Task[];
    
            // Mocking the find method to return the sorted tasks directly
            TaskModel.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    sort: jest.fn().mockResolvedValue(mockTasksSorted) // Return the sorted mock data
                })
            });
    
            const tasks = await Task_Utils.getTasksByDate();
            expect(tasks).toEqual(mockTasksSorted); // Assert the returned tasks match the expected sorted tasks
        });
    });    

    describe('getTaskById', () => {
        it('should return a task by id', async () => {
            const mockTask: Task = { _id: 1, title: 'task1' } as unknown as Task;
            TaskModel.findById = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockTask)
            });

            const task = await Task_Utils.getTaskById(1 as any as Task['_id']);
            expect(task).toEqual(mockTask);
        });

        it('should return null if task not found', async () => {
            TaskModel.findById = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(null)
            });

            const task = await Task_Utils.getTaskById(1 as any as Task['_id']);
            expect(task).toBeNull();
        });
    });

    describe('getTasksByUser', () => {
        it('should return tasks by user id', async () => {
            const mockTasks: Task[] = [{ title: 'task1', user: 'user1' }, { title: 'task2', user: 'user1' }] as any as Task[];
            TaskModel.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockTasks)
            });

            const tasks = await Task_Utils.getTasksByUser('user1' as any as Task['user_id']);
            expect(tasks).toEqual(mockTasks);
        });
    });

    describe('getTasksByStatus', () => {
        it('should return tasks by status', async () => {
            const mockTasks: Task[] = [{ title: 'task1', status: 'To Do' }, { title: 'task2', status: 'To Do' }] as Task[];
            TaskModel.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockTasks)
            });

            const tasks = await Task_Utils.getTasksByStatus('To Do');
            expect(tasks).toEqual(mockTasks);
        });
    });

    describe('getTasksByPriority', () => {
        it('should return tasks by priority', async () => {
            const mockTasks: Task[] = [{ title: 'task1', priority: 'High' }, { title: 'task2', priority: 'High' }] as Task[];
            TaskModel.find = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockTasks)
            });

            const tasks = await Task_Utils.getTasksByPriority('High');
            expect(tasks).toEqual(mockTasks);
        });
    });

    describe('createTask', () => {
        it('should create a new task', async () => {
            const mockTask: Task = { title: 'task1' } as Task;
            TaskModel.prototype.save = jest.fn().mockResolvedValue(mockTask);

            const task = await Task_Utils.createTask({ title: 'task1' });
            expect(task).toEqual(mockTask);
        });
    });

    describe('updateTask', () => {
        it('should update a task', async () => {
            const mockTask: Task = { title: 'task1' } as Task;
            TaskModel.findByIdAndUpdate = jest.fn().mockResolvedValue(mockTask);

            const task = await Task_Utils.updateTask('1' as unknown as number, { title: 'updated task' });
            expect(task).toEqual(mockTask);
        });
    });
});