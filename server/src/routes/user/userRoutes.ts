import express, { Request, Response } from 'express';
const router = express.Router();

// GET all users
router.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Get all users' });
});

// GET single user
router.get('/:id', (req: Request, res: Response) => {
    res.json({ message: `Get user with id: ${req.params.id}` });
});

// POST create user
router.post('/', (req: Request, res: Response) => {
    res.json({ message: 'Create new user' });
});

// PUT update user
router.put('/:id', (req: Request, res: Response) => {
    res.json({ message: `Update user with id: ${req.params.id}` });
});

// DELETE user
router.delete('/:id', (req: Request, res: Response) => {
    res.json({ message: `Delete user with id: ${req.params.id}` });
});

export default router; 