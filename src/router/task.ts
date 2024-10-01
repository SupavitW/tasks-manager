import { Router } from "express";
import { createTask, getTaskById, getTasks, getTasksByPriority, getTasksByStatus, getTasksByUser, updateTask } from "../controllers/task";
import { isAuthenticated, isManager, isOwner } from "../middlewares";

export default (router: Router) => {
    router.post('/createTask', isAuthenticated, isManager, createTask);
    router.get('/tasks', isAuthenticated, getTasks);
    router.get('/tasksByUser/:user_id', isAuthenticated, getTasksByUser);
    router.get('/taskById/:task_id', isAuthenticated, getTaskById);
    router.get('/tasksByStatus', isAuthenticated, getTasksByStatus);
    router.get('/tasksByPriority', isAuthenticated, getTasksByPriority);
    router.put('/updateTask/:task_id', isAuthenticated, isManager, updateTask);
} 