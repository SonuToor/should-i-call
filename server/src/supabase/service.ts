import { z } from 'zod';
import { createUserSchema, updateUserSchema } from '../schema/user';
import supabase from './supabase';
import { transformToSnakeCase, transformToCamelCase } from '../utils/caseTransform';

type CreateUserInput = z.infer<typeof createUserSchema>;
type UpdateUserInput = z.infer<typeof updateUserSchema>;

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
