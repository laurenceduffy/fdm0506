import { Button, Form } from "react-bulma-components";
import { FaDownload } from "react-icons/fa";
import ConfirmCancelModal from "../modals/confirmCancelModal";
import { useState } from "react";
import { downloadUserReport } from "../../api/reports";
import { useToken } from "../../auth/useToken";

const ReportView = ({modalOpen, setModalOpen}) => {
    const [token,] = useToken();
    const [fileType, setFileType] = useState('csv');
    const [sortOrder, setSortOrder] = useState('asc');

    const ModalContent = () => {
        return (
        <>
            <p>Download a report for your currently held shares:</p>
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
                        <option value={'asc'}>Value Asc (Low-High)</option>
                        <option value={'dsc'}>Value Dsc (High-Low)</option>
                    </Form.Select>
                </Form.Control>
            </Form.Field>
        </>);
    }

    const downloadReport = async () => {
        await downloadUserReport(token,fileType,sortOrder);

        setModalOpen(false);
    }

    return (
        <>
            <ConfirmCancelModal open={modalOpen} setOpen={setModalOpen} title={"User Report"} content={<ModalContent />} disableConfirm={false} onConfirm={downloadReport} />
        </>
    );
}

export default ReportView;