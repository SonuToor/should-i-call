/**
 * Utility functions for transforming between camelCase and snake_case
 */

/**
 * Converts a camelCase string to snake_case
 */
export const camelToSnake = (str: string): string => {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

/**
 * Converts a snake_case string to camelCase
 */
export const snakeToCamel = (str: string): string => {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * Transforms an object's keys from camelCase to snake_case
 */
export const transformToSnakeCase = <T extends Record<string, any>>(obj: T): Record<string, any> => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        acc[camelToSnake(key)] = value;
        return acc;
    }, {} as Record<string, any>);
};

/**
 * Transforms an object's keys from snake_case to camelCase
 */
export const transformToCamelCase = <T extends Record<string, any>>(obj: T): Record<string, any> => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        acc[snakeToCamel(key)] = value;
        return acc;
    }, {} as Record<string, any>);
}; 