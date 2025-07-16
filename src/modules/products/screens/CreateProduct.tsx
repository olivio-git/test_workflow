// import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import FormCreateProduct from "../components/FormCreateProduct";
// import TableCreateProduct from "../components/TableCreateProduct";
import { useIsMobile } from "@/hooks/use-mobile";

const CreateProduct = () => { 
  const isMobile = useIsMobile();

  return (
    <div className={isMobile?"h-screen max-h-auto":"h-[91vh] max-h-[91vh]"}>
      <div className="bg-white rounded-lg h-full bg-red-200 w-full">
        {/* <PanelGroup direction={isMobile ? "vertical" : "horizontal"}>
          <Panel className="" minSize={30} maxSize={80} defaultSize={isMobile ? 40 : 55}> */}
            <div className="p-1 w-full h-full overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4 ml-4">Crear Producto</h2>
              <FormCreateProduct />
            </div>
          {/* </Panel> */}
          {/* <PanelResizeHandle className={`${
            isMobile 
              ? "h-1 flex items-center justify-center bg-gray-100 hover:bg-blue-300 transition-colors cursor-row-resize" 
              : "w-1 flex items-center justify-center bg-gray-100 hover:bg-blue-300 transition-colors cursor-col-resize"
          }`}></PanelResizeHandle>
          <Panel className="" minSize={20} maxSize={70} defaultSize={isMobile ? 60 : 45}>
            <div className="p-4 h-full flex flex-col">
              <TableCreateProduct />
            </div>
          </Panel> */}
        {/* </PanelGroup> */}
      </div>
    </div>
  );
};

export default CreateProduct;