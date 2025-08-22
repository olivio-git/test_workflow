// import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import FormCreateProduct from "../components/FormCreateProduct";
// import TableCreateProduct from "../components/TableCreateProduct";

const CreateProduct = () => {

  return (
    <div className={`flex justify-center items-center`}>
      {/* <PanelGroup direction={isMobile ? "vertical" : "horizontal"}>
          <Panel className="" minSize={30} maxSize={80} defaultSize={isMobile ? 40 : 55}> */}
      <div className="max-w-7xl w-full">
        <h2 className="text-lg font-bold">Crear Producto</h2>
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
  );
};

export default CreateProduct;