// components/CategoryItemSkeleton.tsx
const CategoryItemSkeleton = ({ rows }: { rows: number }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between px-4 py-3 border-b border-gray-200 animate-pulse"
        >
          {/* Título de categoría */}
          <div className="w-1/3 h-4 bg-gray-300 rounded" />

          {/* Botones de acciones */}
          <div className="flex space-x-2">
            <div className="w-8 h-4 bg-gray-300 rounded" />
            <div className="w-8 h-4 bg-gray-300 rounded" />
            <div className="w-8 h-4 bg-gray-300 rounded" />
          </div>
        </div>
      ))}
    </>
  );
};

export default CategoryItemSkeleton;
