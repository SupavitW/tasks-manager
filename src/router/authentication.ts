import { Router } from 'express';

import { login, register, logout } from '../controllers/authentication';


export default (router: Router) => {
    router.post('/auth/register', register);
    router.post('/auth/login', login);
    router.get('/auth/logout', logout)
}