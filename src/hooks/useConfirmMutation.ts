import { useCallback, useState } from "react";

type UseConfirmMutationReturn<TVariables> = {
    isOpen: boolean;
    open: (vars?: TVariables) => void;
    close: () => void;
    confirm: () => void;
    variables: TVariables | undefined;
};

const useConfirmMutation = <TData = unknown, TVariables = unknown>(
    mutateFn: (vars: TVariables, options?: {
        onSuccess?: (data: TData, variables: TVariables, context: unknown) => void;
        onError?: (error: unknown, variables: TVariables, context: unknown) => void;
    }) => void,
    onSuccess?: (data: TData, variables: TVariables, context: unknown) => void,
    onError?: (error: unknown, variables: TVariables, context: unknown) => void
): UseConfirmMutationReturn<TVariables> => {
    const [isOpen, setIsOpen] = useState(false);
    const [variables, setVariables] = useState<TVariables | undefined>();

    const open = useCallback((vars?: TVariables) => {
        setVariables(vars);
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
        setVariables(undefined);
    }, []);

    const confirm = useCallback(() => {
        if (variables !== undefined) {
            mutateFn(variables, {
                onSuccess: (data, vars, context) => {
                    onSuccess?.(data, vars, context);
                    close();
                },
                onError: (error, vars, context) => {
                    onError?.(error, vars, context);
                    close();
                }
            });
        }
    }, [variables, mutateFn, onSuccess, onError, close]);

    return {
        isOpen,
        open,
        close,
        confirm,
        variables,
    };
};

export default useConfirmMutation;