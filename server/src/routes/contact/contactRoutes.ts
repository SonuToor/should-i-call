import express, { Request, Response, RequestHandler } from 'express';
import { createContactSchema, updateContactSchema } from '../../schema/contact';
const router = express.Router();

const getContacts: RequestHandler = async (req, res) => {
    try {
        const contacts = [
            { id: 1, name: "Alice", phone: "123-456-7890" },
            { id: 2, name: "Bob", phone: "234-567-8901" },
            { id: 3, name: "Charlie", phone: "345-678-9012" }
        ];
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts' });
    }
}

const getContactById: RequestHandler = async (req, res) => {
    try {
        const contacts = [
            { id: 1, name: "Alice", phone: "123-456-7890" },
            { id: 2, name: "Bob", phone: "234-567-8901" },
            { id: 3, name: "Charlie", phone: "345-678-9012" }
        ];
        const contact = contacts.find((contact) => contact.id === Number(req.params.id));
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
        const result = createContactSchema.safeParse(req.body);

        if (!result.success) {
            res.status(400).json({
                message: 'Validation error',
                errors: result.error.errors
            });
            return;
        }

        const newContact = result.data;
        res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json({ message: 'Error creating contact' });
    }
}

const updateContact: RequestHandler = async (req, res) => {
    try {
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
        const contact = { id: contactId, ...updatedData };

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
        const contactId = Number(req.params.id);
        // Simulate finding and deleting a contact
        const contacts = [
            { id: 1, name: "Alice", phone: "123-456-7890" },
            { id: 2, name: "Bob", phone: "234-567-8901" },
            { id: 3, name: "Charlie", phone: "345-678-9012" }
        ];
        const contact = contacts.find((contact) => contact.id === contactId);
        if (!contact) {
            res.status(404).json({ message: 'Contact not found' });
            return;
        }
        res.json({ message: `Contact ${contactId} deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contact' });
    }
}

// GET all contacts
router.route('/').get(getContacts).post(createContact);

// GET, PUT, DELETE single contact
router.route('/:id').get(getContactById).put(updateContact).delete(deleteContact);

export default router; 