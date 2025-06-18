import express, { Request, RequestHandler, Response } from 'express';
import { createUserSchema, updateUserSchema } from '../../schema/user';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../../supabase/service';
const router = express.Router();

const getUsersHandler: RequestHandler = async (req, res) => {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(400).json({ message: `Error fetching users: ${errorMessage}` });
    }
}

const getUserByIdHandler: RequestHandler = async (req, res) => {
    const userId = req.params.id
    try {
        const user = await getUserById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: `Error fetching user: ${errorMessage}` });
    }
}

const createUserHandler: RequestHandler = async (req, res) => {
    const result = createUserSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            message: 'Validation error',
            errors: result.error.errors
        });
        return;
    }
    try {
        const newUser = await createUser(result.data);
        res.status(201).json(newUser);
        return
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(400).json({ message: `Error creating user: ${errorMessage}` });
    }
}

const updateUserHandler: RequestHandler = async (req, res) => {
    const result = updateUserSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            message: 'Validation error',
            errors: result.error.errors
        });
        return;
    }

    try {
        const updatedUser = await updateUser(req.params.id, result.data);
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: `Error updating user: ${errorMessage}` });
    }
}

const deleteUserHandler: RequestHandler = async (req, res) => {
    try {
        await deleteUser(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json({ message: `Error deleting user: ${errorMessage}` });
    }
}

router.route('/').get(getUsersHandler).post(createUserHandler);
router.route('/:id').get(getUserByIdHandler).put(updateUserHandler).delete(deleteUserHandler);
export default router; 