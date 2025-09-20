import type z from "zod";
import { Logger } from "./logger";

export class Validator {
    static validate<T>(
        schema: z.ZodSchema<T>,
        data: unknown,
        context?: string
    ): T {
        const result = schema.safeParse(data);

        if (!result.success) {
            const errorMessage = `Validation failed${context ? ` for ${context}` : ''}`;

            Logger.error(errorMessage, {
                zodError: result.error.format(),
                receivedData: data,
            }, 'VALIDATOR');

            throw new Error(`Invalid server response${context ? ` for ${context}` : ''}`);
        }

        Logger.debug(
            `Validation successful${context ? ` for ${context}` : ''}`,
            { dataType: typeof data },
            'VALIDATOR'
        );

        return result.data;
    }
}