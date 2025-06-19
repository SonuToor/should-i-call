import express, { Request, Response, RequestHandler } from 'express';
import { createContactSchema, updateContactSchema } from '../../schema/contact';
import { createContact, getContacts, getContactById, updateContact, deleteContact } from '../../supabase/service';
const router = express.Router({ mergeParams: true });

// All handlers now expect req.params.userId
const getContactsHandler: RequestHandler = async (req, res) => {
    try {
        const userId = req.params.userId;
        const contacts = await getContacts(userId);
        res.status(200).json(contacts);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(400).json({ message: `Error fetching contacts: ${errorMessage}` });
    }
};

const getContactByIdHandler: RequestHandler = async (req, res) => {
    try {
        const userId = req.params.userId;
        const contactId = req.params.id
        const contact = await getContactById(contactId, userId);
        if (!contact) {
            res.status(404).json({ message: 'Contact not found' });
            return;
        }
        res.status(200).json(contact);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: `Error fetching contact: ${errorMessage}` });
    }
};

const createContactHandler: RequestHandler = async (req, res) => {
    const userId = req.params.userId;
    const result = createContactSchema.safeParse({ ...req.body, userId });
    if (!result.success) {
        res.status(400).json({
            message: 'Validation error',
            errors: result.error.errors
        });
        return;
    }
    try {
        const newContact = await createContact(result.data);
        res.status(201).json(newContact);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(400).json({ message: `Error creating contact: ${errorMessage}` });
    }
};

const updateContactHandler: RequestHandler = async (req, res) => {
    const userId = req.params.userId;
    const result = updateContactSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({
            message: 'Validation error',
            errors: result.error.errors
        });
        return;
    }
    try {
        const updatedContact = await updateContact(req.params.id, userId, result.data);
        if (!updatedContact) {
            res.status(404).json({ message: 'Contact not found' });
            return;
        }
        res.status(200).json(updatedContact);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: `Error updating contact: ${errorMessage}` });
    }
};

const deleteContactHandler: RequestHandler = async (req, res) => {
    try {
        const userId = req.params.userId;
        await deleteContact(req.params.id, userId);
        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: `Error deleting contact: ${errorMessage}` });
    }
};

// GET all contacts for a user, POST create contact for a user
router.route('/')
    .get(getContactsHandler)
    .post(createContactHandler);

// GET, PUT, DELETE single contact for a user
router.route('/:id')
    .get(getContactByIdHandler)
    .put(updateContactHandler)
    .delete(deleteContactHandler);

export default router; 