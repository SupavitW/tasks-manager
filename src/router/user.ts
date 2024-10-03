import { Router } from 'express';
import { deleteUser, getUsers, updateUser } from '../controllers/user';
import { isAuthenticated, isManager, isOwner } from '../middlewares';



export default (router: Router) => {
    router.get('/users', isAuthenticated, getUsers );
    router.patch('/user/update/:id', isAuthenticated, isOwner, updateUser);
    router.delete('/user/delete/:id', isAuthenticated, isManager, deleteUser);
}