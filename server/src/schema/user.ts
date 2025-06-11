import { z } from 'zod';

// Define the user schema
export const userSchema = z.object({
    firstName: z.string().min(3, 'First name is required'),
    lastName: z.string().min(3, 'Last name is required'),
    email: z.string().email('Invalid email format')
});

// Schema for user creation (all fields required)
export const createUserSchema = userSchema;

// Schema for user update (all fields optional)
export const updateUserSchema = userSchema.partial();