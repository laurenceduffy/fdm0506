import { getStockDetails } from "../../utility/stockDetails";
import { Button, Form, Columns } from "react-bulma-components";
import { FaDownload } from "react-icons/fa";
import ConfirmCancelModal from "../modals/confirmCancelModal";
import { useState } from "react";
import { downloadStockReport } from "../../api/reports";
import { useToken } from "../../auth/useToken";
import Scrollbars from "react-custom-scrollbars";

const ReportView = ({stocks}) => {
    const [token,] = useToken();
    const [modalOpen, setModalOpen] = useState(false);
    const [stockList, setStockList] = useState([]);
    const [fileType, setFileType] = useState('csv');
    const [sortOrder, setSortOrder] = useState('asc');

    const toggleStockItem = symbol => {
        if(stockList.includes(symbol)) {
            const filtered = stockList.filter(x => { return symbol !== x });
            setStockList(filtered);
        } else {
            setStockList([...stockList, symbol]);
        }
    }

    const stockItems = stocks.map(data => {
        const details = getStockDetails(data);

        return  <Form.Field key={details.symbol}>
                    <Form.Control>
                        <Form.Checkbox value={details.symbol} onChange={e => {toggleStockItem(details.symbol)}} checked={stockList.includes(details.symbol)}>
                            {details.symbol}
                        </Form.Checkbox>
                    </Form.Control>
                </Form.Field>
    });

    const ModalContent = () => {
        return (
        <>
            <Columns>
                <Columns.Column className="pr-0" size={4}>
                    <Scrollbars style={{ height: 300 }}>
                        {stockItems}
                    </Scrollbars>
                </Columns.Column>

                <Columns.Column size={8}>
                    <Form.Field>
                        <Form.Label>
                            <p>Selection</p>
                        </Form.Label>
                        <Form.Control>
                            <Button className="mr-2" onClick={() => {
                                    setStockList(stocks.map(data => {
                                        const details = getStockDetails(data);

                                        return details.symbol;
                                    }));
                                }}>Select All</Button>
                            <Button onClick={() => {setStockList([])}}>De-select All</Button>
                        </Form.Control>
                    </Form.Field>

                    <hr/>

                    <Form.Field>
                        <Form.Label>
                            <p>File Type</p>
                        </Form.Label>
                        <Form.Control>
                            <Form.Select onChange={e => {setFileType(e.target.value)}} value={fileType}>
                                <option value={'csv'}>.csv</option>
                                <option value={'xml'}>.xml</option>
                            </Form.Select>
                        </Form.Control>
                    </Form.Field>

                    <Form.Field>
                        <Form.Label>
                            <p>Sort Order</p>
                        </Form.Label>
                        <Form.Control>
                            <Form.Select onChange={e => {setSortOrder(e.target.value)}} value={sortOrder}>
                                <option value={'asc'}>Symbol Asc (A-Z)</option>
                                <option value={'dsc'}>Symbol Dsc (Z-A)</option>
                            </Form.Select>
                        </Form.Control>
                    </Form.Field>
                </Columns.Column>
            </Columns>
        </>);
    }

    const downloadReport = async () => {
        await downloadStockReport(token,stockList,fileType,sortOrder);

        setModalOpen(false);
    }

    return (
        <>
            <Button onClick={() => {setModalOpen(true)} }><FaDownload className="mr-2"/> Download Snapshot Report</Button>

            <ConfirmCancelModal open={modalOpen} setOpen={setModalOpen} title={"Stock Report"} content={<ModalContent />} disableConfirm={stockList.length === 0} onConfirm={downloadReport} />
        </>
    );
}

export default ReportView;