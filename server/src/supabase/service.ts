import { z } from 'zod';
import { createUserSchema, updateUserSchema } from '../schema/user';
import supabase from './supabase';
import { transformToSnakeCase, transformToCamelCase } from '../utils/caseTransform';
import { createContactSchema, updateContactSchema } from '../schema/contact';

type CreateUserInput = z.infer<typeof createUserSchema>;
type UpdateUserInput = z.infer<typeof updateUserSchema>;
type CreateContactInput = z.infer<typeof createContactSchema>;
type UpdateContactInput = z.infer<typeof updateContactSchema>;

export const createUser = async (userData: CreateUserInput) => {
    const snakeCaseData = transformToSnakeCase(userData);

    const { data, error } = await supabase
        .from('users')
        .insert(snakeCaseData)
        .select()
        .single();

    if (error) {
        console.log(error)
        throw new Error(error.message)
    }

    return transformToCamelCase(data);
};

export const getUsers = async () => {
    const { data, error } = await supabase
        .from('users')
        .select('*');

    if (error) {
        console.log(error);
        throw new Error(error.message);
    }

    return data.map(transformToCamelCase);
};

export const getUserById = async (id: string) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.log(error);
        if (error.code === 'PGRST116') {
            return null
        } else {
            throw new Error(error.message);
        }
    }

    return transformToCamelCase(data);
};

export const updateUser = async (id: string, userData: UpdateUserInput) => {
    const snakeCaseData = transformToSnakeCase(userData);

    const { data, error } = await supabase
        .from('users')
        .update(snakeCaseData)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.log(error);
        throw new Error(error.message);
    }

    return transformToCamelCase(data);
};

// TODO: update to be a soft delete
export const deleteUser = async (id: string) => {
    const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

    if (error) {
        console.log(error);
        throw new Error(error.message);
    }
};

export const createContact = async (contactData: CreateContactInput) => {
    const snakeCaseData = transformToSnakeCase(contactData);
    const { data, error } = await supabase
        .from('contacts')
        .insert(snakeCaseData)
        .select()
        .single();
    if (error) {
        console.log(error);
        throw new Error(error.message);
    }
    return transformToCamelCase(data);
};

export const getContacts = async (userId: string) => {
    const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', userId);
    if (error) {
        console.log(error);
        throw new Error(error.message);
    }
    return data.map(transformToCamelCase);
};

export const getContactById = async (id: string, userId: string) => {
    const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();
    if (error) {
        console.log(error);
        if (error.code === 'PGRST116') {
            return null;
        } else {
            throw new Error(error.message);
        }
    }
    return transformToCamelCase(data);
};

export const updateContact = async (id: string, userId: string, contactData: UpdateContactInput) => {
    const snakeCaseData = transformToSnakeCase(contactData);
    const { data, error } = await supabase
        .from('contacts')
        .update(snakeCaseData)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
    if (error) {
        console.log(error);
        throw new Error(error.message);
    }
    return transformToCamelCase(data);
};

export const deleteContact = async (id: string, userId: string) => {
    const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);
    if (error) {
        console.log(error);
        throw new Error(error.message);
    }
};
