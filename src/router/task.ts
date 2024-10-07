import { Router } from "express";
import { createTask, getTaskById, getTasks, getTasksByDate, getTasksByPriority, getTasksByStatus, getTasksByUser, updateTask } from "../controllers/task";
import { isAuthenticated, isManager, isOwner } from "../middlewares";

export default (router: Router) => {
    router.post('/createTask', isAuthenticated, isManager, createTask);
    router.get('/getTasks', isAuthenticated, getTasks);
    router.get('/getTasksByDate', isAuthenticated, getTasksByDate);
    router.get('/getTasksByUser/:user_id', isAuthenticated, getTasksByUser);
    router.get('/getTaskById/:task_id', isAuthenticated, getTaskById);
    router.get('/getTasksByStatus', isAuthenticated, getTasksByStatus);
    router.get('/getTasksByPriority', isAuthenticated, getTasksByPriority);
    router.put('/updateTask/:task_id', isAuthenticated, isManager, updateTask);
} 