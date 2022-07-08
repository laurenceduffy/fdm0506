import { useState } from "react";
import { Heading, Columns, Notification } from "react-bulma-components";
import { FaPlus } from 'react-icons/fa';
import CompanyDetailsModal from "../modals/companyDetailsModal";

const AddStockItem = () => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <Columns.Column size={12} style={{width:360}} backgroundColor="light">
                <Notification className="p-4 has-text-left" onClick={async () => {setModalOpen(true)}} color="white" className="is-clickable">
                    <Columns>
                        <Columns.Column size={2}>
                            <Heading size={6} p={1}><FaPlus /></Heading>
                        </Columns.Column>
                        <Columns.Column size={10}>
                            <Heading size={6} p={1} subtitle={true}>Add New Company</Heading>
                        </Columns.Column>
                    </Columns>
                </Notification>
            </Columns.Column>

            <CompanyDetailsModal open={modalOpen} setOpen={setModalOpen} />
        </>
    );
}

export default AddStockItem;