import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import FormCreateProduct from "../components/FormCreateProduct";
import TableCreateProduct from "../components/TableCreateProduct";

const CreateProduct = () => {
    return (
        <div className="min-h-screen">
            <div className="bg-white rounded-lg shadow-sm">
                <PanelGroup direction="horizontal">
                    <Panel minSize={30} maxSize={80} defaultSize={65}>
                        <div className="p-2">
                            <h2 className="text-lg font-semibold mb-4">Crear Producto</h2>
                            <FormCreateProduct />
                        </div>
                    </Panel>
                    <PanelResizeHandle className="w-1 bg-gray-200 cursor-col-resize" />
                    <Panel minSize={20} maxSize={70} defaultSize={35}>
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
