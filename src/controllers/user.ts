import express, { Request, Response } from 'express';

import { getAllUsers, createUser, login } from '../services/user';
import { IUser, IUserLogin } from '../models/interfaces/user';
import { IBaseRequest } from '../models/interfaces/util/base-data';

import { authenticateToken, emptyBodyCheck, paginationCheck } from './middleware/middleware';

const router = express.Router();

router.get('/', [authenticateToken, paginationCheck], async (req: Request, res: Response) => {

    const requestData: IBaseRequest = {
        pageIndex: Number(req.query.page),
        pageSize: Number(req.query.size)
    }

    const users = await getAllUsers(requestData);

    res.json(users);
})

router.post('/', [emptyBodyCheck], async (req: Request, res: Response) => {
    try {
        await createUser(req.body as IUser);
        res.status(200).send("User successfully created!");

    } catch (error) {
        res.status(400).json(JSON.stringify(error));
    }
})

router.post('/login', [emptyBodyCheck], async (req: Request, res: Response) => {
    const data = await login(req.body as IUserLogin);
    if (!data) {
        res.status(404).json("User could not be found!");
    }
    else {
        res.status(200).json(data);
    };
})

router.delete('/delete/:id', /*[authenticateToken],*/ async (req: Request, res: Response) => {
    const id = req.query.id;
    if (!id) res.status(400).json({ message: "User not provided!" });

})

export default router;