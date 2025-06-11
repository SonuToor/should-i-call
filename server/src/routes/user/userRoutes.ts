import express, { Request, RequestHandler, Response } from 'express';
import { createUserSchema, updateUserSchema } from '../../schema/user';
const router = express.Router();



const getUsers = async (req: Request, res: Response) => {
    try {
        const users = ["hey", "there", "how", "are", "you"];
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
}

const getUserById = async (req: Request, res: Response) => {
    try {
        const users = [{ id: 1, name: "John" }, { id: 2, name: "Jane" }, { id: 3, name: "Jim" }];
        const user = users.find((user) => user.id === Number(req.params.id));
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user' });
    }
}

const createUser: RequestHandler = async (req, res) => {
    try {
        const result = createUserSchema.safeParse(req.body);

        if (!result.success) {
            res.status(400).json({
                message: 'Validation error',
                errors: result.error.errors
            });
            return;
        }

        const newUser = result.data;
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
}

const updateUser: RequestHandler = async (req, res) => {
    try {
        const userId = req.params.id;
        const result = updateUserSchema.safeParse(req.body);

        if (!result.success) {
            res.status(400).json({
                message: 'Validation error',
                errors: result.error.errors
            });
            return;
        }

        const updatedData = result.data;
        const user = { id: userId, ...updatedData };

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user' });
    }
}

const deleteUser: RequestHandler = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        // Simulate finding and deleting a user
        const users = [{ id: 1, name: "John" }, { id: 2, name: "Jane" }, { id: 3, name: "Jim" }];
        const user = users.find((user) => user.id === userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: `User ${userId} deleted successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
}


router.route('/').get(getUsers).post(createUser);
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);
export default router; 