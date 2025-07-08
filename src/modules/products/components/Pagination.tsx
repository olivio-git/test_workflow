import { Button } from "@/components/atoms/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const Pagination = () => {
  return (
    <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="default" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              4
            </Button>
            <Button variant="outline" size="sm">
              5
            </Button>
            <Button variant="outline" size="sm">
              6
            </Button>
            <span className="text-gray-500">...</span>
            <Button variant="outline" size="sm">
              24
            </Button>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
  )
}

export default Pagination