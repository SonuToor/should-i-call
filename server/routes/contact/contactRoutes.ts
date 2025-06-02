import express from 'express';
const router = express.Router();

// GET all contacts
router.get('/', (req, res) => {
    res.json({ message: 'Get all contacts' });
});

// GET single contact
router.get('/:id', (req, res) => {
    res.json({ message: `Get contact with id: ${req.params.id}` });
});

// POST create contact
router.post('/', (req, res) => {
    res.json({ message: 'Create new contact' });
});

// PUT update contact
router.put('/:id', (req, res) => {
    res.json({ message: `Update contact with id: ${req.params.id}` });
});

// DELETE contact
router.delete('/:id', (req, res) => {
    res.json({ message: `Delete contact with id: ${req.params.id}` });
});

export default router; 