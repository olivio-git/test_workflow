import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import FormCreateProduct from "../components/FormCreateProduct";
import TableCreateProduct from "../components/TableCreateProduct";

const CreateProduct = () => {
  return (
    <div className="">
      <div className="bg-white rounded-lg shadow-sm">
        <PanelGroup direction="horizontal">
          <Panel minSize={30} maxSize={80} defaultSize={55}>
            <div className="p-1">
              <h2 className="text-lg font-semibold mb-4">Crear Producto</h2>
              <FormCreateProduct />
            </div>
          </Panel>
          <PanelResizeHandle className="w-1 flex items-center justify-center bg-gray-100 hover:bg-blue-300 transition-colors cursor-col-resize"></PanelResizeHandle>
          <Panel minSize={20} maxSize={70} defaultSize={45}>
            <div className="p-4">
              <TableCreateProduct />
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};

export default CreateProduct;
