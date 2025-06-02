import express from 'express';
const router = express.Router();

// GET all users
router.get('/', (req, res) => {
    res.json({ message: 'Get all users' });
});

// GET single user
router.get('/:id', (req, res) => {
    res.json({ message: `Get user with id: ${req.params.id}` });
});

// POST create user
router.post('/', (req, res) => {
    res.json({ message: 'Create new user' });
});

// PUT update user
router.put('/:id', (req, res) => {
    res.json({ message: `Update user with id: ${req.params.id}` });
});

// DELETE user
router.delete('/:id', (req, res) => {
    res.json({ message: `Delete user with id: ${req.params.id}` });
});

export default router; 