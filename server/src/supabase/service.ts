import { z } from 'zod';
import { createUserSchema } from '../schema/user';
import supabase from './supabase';
import { transformToSnakeCase, transformToCamelCase } from '../utils/caseTransform';

type CreateUserInput = z.infer<typeof createUserSchema>;

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
