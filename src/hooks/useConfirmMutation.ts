import { useState } from "react";

type UseConfirmMutationReturn<TVariables> = {
    isOpen: boolean;
    open: (vars?: TVariables) => void;
    close: () => void;
    confirm: () => void;
    variables: TVariables | undefined;
};

const useConfirmMutation = <TVariables = void>(
    mutateFn: (vars: TVariables, options?: {
        onSuccess?: (data: any, variables: TVariables) => void;
        onError?: (error: any, variables: TVariables) => void;
    }) => void,
    onSuccess?: (data: any, variables: TVariables) => void,
    onError?: (error: any, variables: TVariables) => void
): UseConfirmMutationReturn<TVariables> => {
    const [isOpen, setIsOpen] = useState(false);
    const [variables, setVariables] = useState<TVariables | undefined>();

    const open = (vars?: TVariables) => {
        setVariables(vars);
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
        setVariables(undefined);
    };

    const confirm = () => {
        if (variables !== undefined) {
            mutateFn(variables, {
                onSuccess: (data, vars) => {
                    onSuccess?.(data, vars);
                    close();
                },
                onError: (error, vars) => {
                    onError?.(error, vars);
                    close();
                }
            });
        }
    };

    return {
        isOpen,
        open,
        close,
        confirm,
        variables,
    };
};

export default useConfirmMutation;