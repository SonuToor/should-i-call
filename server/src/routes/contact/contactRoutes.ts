import express, { Request, Response, RequestHandler } from 'express';
import { createContactSchema, updateContactSchema } from '../../schema/contact';
const router = express.Router({ mergeParams: true });

// All handlers now expect req.params.userId
const getContacts: RequestHandler = async (req, res) => {
    try {
        const userId = req.params.userId;
        // In a real app, filter contacts by userId
        const contacts = [
            { id: 1, name: "Alice", phone: "123-456-7890", userId: "1" },
            { id: 2, name: "Bob", phone: "234-567-8901", userId: "2" },
            { id: 3, name: "Charlie", phone: "345-678-9012", userId: "1" }
        ];
        // Filter contacts by userId
        const userContacts = contacts.filter(contact => contact.userId === userId);
        res.status(200).json(userContacts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts' });
    }
}

const getContactById: RequestHandler = async (req, res) => {
    try {
        const userId = req.params.userId;
        const contacts = [
            { id: 1, name: "Alice", phone: "123-456-7890", userId: "1" },
            { id: 2, name: "Bob", phone: "234-567-8901", userId: "2" },
            { id: 3, name: "Charlie", phone: "345-678-9012", userId: "1" }
        ];
        const contact = contacts.find((contact) => contact.id === Number(req.params.id) && contact.userId === userId);
        if (!contact) {
            res.status(404).json({ message: 'Contact not found' });
            return;
        }
        res.json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contact' });
    }
}

const createContact: RequestHandler = async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = createContactSchema.safeParse(req.body);

        if (!result.success) {
            res.status(400).json({
                message: 'Validation error',
                errors: result.error.errors
            });
            return;
        }

        const newContact = { ...result.data, userId };
        res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json({ message: 'Error creating contact' });
    }
}

const updateContact: RequestHandler = async (req, res) => {
    try {
        const userId = req.params.userId;
        const contactId = req.params.id;
        const result = updateContactSchema.safeParse(req.body);

        if (!result.success) {
            res.status(400).json({
                message: 'Validation error',
                errors: result.error.errors
            });
            return;
        }

        const updatedData = result.data;
        const contact = { id: contactId, ...updatedData, userId };

        if (!contact) {
            res.status(404).json({ message: 'Contact not found' });
            return;
        }

        res.json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Error updating contact' });
    }
}

const deleteContact: RequestHandler = async (req, res) => {
    try {
        const userId = req.params.userId;
        const contactId = Number(req.params.id);
        // Simulate finding and deleting a contact
        const contacts = [
            { id: 1, name: "Alice", phone: "123-456-7890", userId: "1" },
            { id: 2, name: "Bob", phone: "234-567-8901", userId: "2" },
            { id: 3, name: "Charlie", phone: "345-678-9012", userId: "1" }
        ];
        const contact = contacts.find((contact) => contact.id === contactId && contact.userId === userId);
        if (!contact) {
            res.status(404).json({ message: 'Contact not found' });
            return;
        }
        res.json({ message: `Contact ${contactId} deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contact' });
    }
}

// GET all contacts for a user, POST create contact for a user
router.route('/')
    .get(getContacts)
    .post(createContact);

// GET, PUT, DELETE single contact for a user
router.route('/:id')
    .get(getContactById)
    .put(updateContact)
    .delete(deleteContact);

export default router; 