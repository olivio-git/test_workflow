import { Button } from "@/components/atoms/button";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  perPage: number;
  onPerPageChange: (value: number) => void;
}

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  perPage,
  onPerPageChange,
}: Props) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-4 sm:flex-row sm:gap-4">
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Registros por página:</label>
        <select
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          className="px-2 py-1 text-sm border border-gray-300 rounded"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="flex items-center gap-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
        >
          ← Anterior
        </Button>

        <span className="text-sm text-gray-700">
          Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
        </span>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
        >
          Siguiente →
        </Button>
      </div>
    </div>
  );
};

export default PaginationControls;
