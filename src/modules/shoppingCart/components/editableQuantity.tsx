import { EditableField, type EditableFieldProps } from "@/components/common/EditableField";

export const EditableQuantity: React.FC<Omit<EditableFieldProps, 'type' | 'numberProps'>> = (props) => (
    <EditableField
        {...props}
        type="number"
        numberProps={{ min: 1, step: 1 }}
        formatter={(value) => value.toString()}
    />
);
