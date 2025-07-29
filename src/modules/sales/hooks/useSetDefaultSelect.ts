import { useEffect, useMemo } from "react";
import type { Path, UseFormGetValues, UseFormSetValue } from "react-hook-form";

export function useSetDefaultSelect<T extends object>(
    data: Record<string, string> | undefined,
    fieldName: Path<T>,
    getValues: UseFormGetValues<T>,
    setValue: UseFormSetValue<T>,
    explicitDefaultValue?: string | number
) {
    const defaultKey = useMemo(() => {
        if (!data) return undefined;

        if (explicitDefaultValue !== undefined && data.hasOwnProperty(String(explicitDefaultValue))) {
            return String(explicitDefaultValue);
        }

        return Object.keys(data)[0];
    }, [data, explicitDefaultValue]);

    useEffect(() => {
        if (defaultKey && !getValues(fieldName)) {
            setValue(fieldName, defaultKey as any);
        }
    }, [defaultKey]);
}