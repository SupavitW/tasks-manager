import express from 'express';
import authentication from './authentication';
import user from './user';
import task from './task';

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    user(router);
    task(router);
    return router;
};