import { Kbd } from "../atoms/kbd";

type ShortcutKeyProps = {
    combo: string; // Ej: "Ctrl + Shift + C"
};

const ShortcutKey: React.FC<ShortcutKeyProps> = ({ combo }) => {
    const keys = combo.split('+').map(k => k.trim());

    return (
        <span className="inline-flex gap-1 items-center">
            {keys.map((key, index) => (
                <Kbd
                    key={index}
                >
                    {key}
                </Kbd>
            ))}
        </span>
    );
};
export default ShortcutKey;