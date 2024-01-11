import express, { Request, Response } from 'express';
import { authenticateToken, emptyBodyCheck } from "./middleware/middleware";
import { getReadings, getReadingsLast30Days, getReadings24Hours, postReading, syncReadings } from '../services/reading';

const router = express.Router();

router.get('/:deviceId', [authenticateToken], async (req: Request, res: Response) => {
    if (!req.params.deviceId) {
        res.status(400);
        return;
    }
    const data = await getReadings(req.params.deviceId as string);
    res.status(200).send(data);
})

router.get('/:deviceId/day', [authenticateToken], async (req: Request, res: Response) => {
    if (!req.params.deviceId) {
        res.status(400);
        return;
    }
    const data = await getReadings24Hours(req.params.deviceId);
    res.status(200).send(data);
})

router.get('/:deviceId/month', [authenticateToken], async (req: Request, res: Response) => {
    if (!req.params.deviceId) {
        res.status(400);
        return;
    }
    const data = await getReadingsLast30Days(req.params.deviceId);
    res.status(200).send(data);
})

router.post('/', [authenticateToken, emptyBodyCheck], async (req: Request, res: Response) => {
    await postReading(req.body);
    res.status(200).send("Reading successfully added!");
});


router.post('/sync', [authenticateToken, emptyBodyCheck], async (req: Request, res: Response) => {
    await syncReadings(req.body);
    res.status(200).send("Reading successfully added!");
});

export default router;