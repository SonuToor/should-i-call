import express, { Request, Response, RequestHandler } from 'express';
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
        const contact = req.body;
        // Simulate creating a new contact with an ID
        const newContact = { id: Math.floor(Math.random() * 1000), ...contact };
        res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json({ message: 'Error creating contact' });
    }
}

const updateContact: RequestHandler = async (req, res) => {
    try {
        const contactId = Number(req.params.id);
        const updatedData = req.body;
        // Simulate finding and updating a contact
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
        const updatedContact = { ...contact, ...updatedData };
        res.json(updatedContact);
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