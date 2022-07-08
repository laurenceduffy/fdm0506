import { getStockDetails } from "../../utility/stockDetails";
import StockListItem from "./stockListItem";
import AddStockItem from "./addStockItem";
import { useAdmin } from "../../auth/useAdmin";

const StockList = ({stocks, activeStock, setActiveStock}) => {
    const [adminToken,] = useAdmin();

    const stockItems = stocks.map(data => {
        const details = getStockDetails(data);

        return <StockListItem
                    key={details.symbol}
                    details={details}
                    activeStock={activeStock}
                    setActiveStock={setActiveStock}
                />
    });

    return (
    <>
        {adminToken ? <AddStockItem /> : <></>}
        {stockItems}
    </>
    );
};

export default StockList;