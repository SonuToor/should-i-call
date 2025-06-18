import { z } from 'zod';

// Define the ContactFrequency enum
export const ContactFrequency = z.enum([
    'DAILY',
    'SEMI-WEEKLY',
    'WEEKLY',
    'BI-WEEKLY',
    'MONTHLY',
    'BI-MONTHLY',
    'QUARTERLY',
]);


// Define the contact schema
export const contactSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    contactFrequency: ContactFrequency,
    lastContacted: z.date().nullable(),
    userId: z.string().uuid()
});

// Schema for contact creation (all fields required except id, createdAt, and lastContacted)
export const createContactSchema = contactSchema

// Schema for contact update (all fields optional)
export const updateContactSchema = contactSchema.partial(); 