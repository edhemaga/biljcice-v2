import express, { Request, Response } from 'express';
import { IBaseRequest } from '../models/interfaces/util/base-data';
import { getSensors, getSensor, addSensor, activateSensor, deactivateSensor, deleteSensor, updateSensor } from '../services/sensor';
import { authenticateToken, checkIdParam, emptyBodyCheck } from './middleware/middleware';
import { ISensor } from '../models/interfaces/sensor';

const router = express.Router();

router.get('/', [authenticateToken], async (req: Request, res: Response) => {
    if (!req.query?.page || !req.query?.size || !req.query.device) {
        res.status(400).json({ message: "Bad request!" });
        return;
    }

    const requestData: IBaseRequest = {
        pageIndex: Number(req.query.page),
        pageSize: Number(req.query.size),
        filter: String(req.query.device),
    };

    const response = await getSensors(requestData);
    res.status(200).json(response.data);
});

router.get('/:id', [authenticateToken, checkIdParam], async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = (await getSensor(id))[0];
    res.status(200).json(result);
});

router.post('/', [authenticateToken, emptyBodyCheck], async (req: Request, res: Response) => {
    await addSensor(req.body as ISensor);
    res.status(200).json({ message: "Sensor added successfully!" });
});

router.put('/:id/config', [authenticateToken, checkIdParam], async (req: Request, res: Response) => {
    const { high, low } = req.body;
    if (high < 0 || low < 0 || high < low) res.status(404).json({ message: "Boundary values cannot be negative!" });
    const sensor: Partial<ISensor> = {
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        high: Number(req.body.high),
        low: Number(req.body.low)
    }
    await updateSensor(sensor, req.params.id);
    res.status(200).json({ message: "Sensor successfully activated!" });
});


router.put('/:id/activate', [authenticateToken, checkIdParam], async (req: Request, res: Response) => {
    await activateSensor(req.params.id);
    res.status(200).json({ message: "Sensor successfully activated!" });
});

router.put('/:id/deactivate', [authenticateToken, emptyBodyCheck, checkIdParam], async (req: Request, res: Response) => {
    await deactivateSensor(req.params.id);
    res.status(200).json({ message: "Sensor successfully deactivated!" });
});

router.delete('/:id', [authenticateToken, checkIdParam], async (req: Request, res: Response) => {
    await deleteSensor(req.params.id);
    res.status(200).json({ message: "Sensor successfully deleted!" });
});

export default router;