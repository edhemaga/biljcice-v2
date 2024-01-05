import express, { Request, Response } from 'express';

import { IBaseRequest, IBaseResponse } from '../models/interfaces/util/base-data';
import { activateDevice, addDevice, deactivateDevice, getDevice, getDevices } from '../services/device';
import { IDevice, IDeviceDTO } from '../models/interfaces/device';
import { authenticateToken, checkIdParam, emptyBodyCheck } from './middleware/middleware';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {

    if (!req.query?.page || !req.query?.size || !req.query?.user) res.status(400).json({ meesage: "Bad request!" });

    const requestData: IBaseRequest = {
        pageIndex: Number(req.query.page),
        pageSize: Number(req.query.size),
        filter: String(req.query.user)
    }
    const response = await getDevices(requestData);
    res.status(200).json(response.data);
});

router.get('/:id', [authenticateToken, checkIdParam], async (req: Request, res: Response) => {
    const result = (await getDevice(req.params.id))[0];
    res.status(200).json(result);
});

router.post('/', [authenticateToken, emptyBodyCheck], async (req: Request, res: Response) => {
    await addDevice(req.body as IDeviceDTO);
    res.status(200).json({ message: "Device added successfully!" })
});

router.put('/', async (req: Request, res: Response) => {
    res.status(404).json({ message: "Not implemented!" })
})

router.put('/activate/:id', [authenticateToken, checkIdParam], async (req: Request, res: Response) => {
    await activateDevice(req.params.id);
    res.status(200).json({ message: "Device successfully activated!" })
})

router.put('/deactivate/:id', [authenticateToken, checkIdParam], async (req: Request, res: Response) => {
    await deactivateDevice(req.params.id);
    res.status(200).json({ message: "Device successfully deactivated!" })
})

router.delete('/:id', [authenticateToken, checkIdParam], async (req: Request, res: Response) => {
    await deactivateDevice(req.params.id);
    res.status(200).json({ message: "Device successfully deactivated!" })
})

export default router;