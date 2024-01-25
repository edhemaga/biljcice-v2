import express, { Request, Response } from 'express';

import { getAlertBySeverity, getAlertBySeverityInLast24Hours, getAlerts } from '../services/alert';
import { IBaseRequest } from '../models/interfaces/util/base-data';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    if (!req.query?.page || !req.query?.size || !req.query.device) {
        res.status(400).json({ message: "Bad request!" });
        return;
    }

    const requestData: IBaseRequest = {
        pageIndex: Number(req.query.page),
        pageSize: Number(req.query.size),
        filter: String(req.query.device),
    };

    const response = await getAlerts(requestData);

    res.status(200).json(response);
});

router.get('/day', async (req: Request, res: Response) => {
    if (!req.query.device) {
        res.status(400).json({ message: "Bad request!" });
        return;
    }

    const response = await getAlertBySeverityInLast24Hours(String(req.query.device));

    res.status(200).json(response);

})

router.get('/all', async (req: Request, res: Response) => {
    if (!req.query.device) {
        res.status(400).json({ message: "Bad request!" });
        return;
    }

    const response = await getAlertBySeverity(String(req.query.device));

    res.status(200).json(response);

})

export default router;