import { deleteStock } from "../../api/stocks";
import { useAdmin } from "../../auth/useAdmin";
import ConfirmCancelModal from "./confirmCancelModal";

const DeleteCompanyModal = ({open, setOpen, symbol}) => {
    const [adminToken,] = useAdmin();
    
    const deleteCompany = async() =>
    {
        await deleteStock(adminToken, symbol);

        setOpen(false);
    }

    return (
        <ConfirmCancelModal open={open} setOpen={setOpen} title={`Delete ${symbol}`} content={(<p>Are you sure you want to delete this listing?</p>)} onConfirm={deleteCompany}/>
    );
}

export default DeleteCompanyModal;