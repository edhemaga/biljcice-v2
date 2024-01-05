import { Request, Response, RequestHandler, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

//JWT Authentication Tutorial - Node.js (Youtube)
export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction) => {

    const authHeader = req.headers['authorization'];
    const token = (authHeader && authHeader.split(' ')[1]) ?? null;
    if (!token) return res.sendStatus(401);

    jwt.verify(token, (process.env.SECRET_KEY || ''), (err, user) => {
        if (err)
            return res.sendStatus(403);
        next();
    })
}

export const paginationCheck = (
    req: Request,
    res: Response,
    next: NextFunction) => {

    if (!req.query?.page || !req.query?.size)
        return res
            .status(400)
            .json({ meesage: "Bad request!" });
    next();
}

export const emptyBodyCheck = (req: Request, res: Response, next: NextFunction) => {
    const emptyBody =
        (!req.body || Object.keys(req.body).length == 0) ?? false;

    if (emptyBody)
        return res
            .status(400)
            .json({ message: "No data body provided!" });
    next();
}

export const checkIdParam = (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.id) res.status(400).json({ message: "Bad request!" });
    next();
}