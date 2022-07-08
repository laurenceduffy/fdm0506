import { useEffect, useState } from "react";
import { Columns, Heading } from "react-bulma-components";
import Scrollbars from "react-custom-scrollbars";
import StockChart from "./stockChart"
import StockList from "./stockList";
import StockFilter from "./stockFilter";
import ReportView from "./stockReportView";

const StockView = ({stocks, title}) => {
    const [activeStock, setActiveStock] = useState(null);
    const [filteredStocks, setFilteredStocks] = useState(stocks);
    const [chartPrices, setChartPrices] = useState([]);
    
    useEffect(() => {
        if(activeStock) {
            const stock = stocks.filter(stock => {return stock.symbol === activeStock.symbol})[0];

            setChartPrices(stock.values.prices);
        }
    }, [activeStock])
    

    return (
    <>
        <Heading subtitle={true}>{title}</Heading>

        <StockFilter stocks={stocks} setStocks={setFilteredStocks} />

        <Columns gap="0">
            <Columns.Column className="pr-0" size={4}>
                <Scrollbars style={{ height: 600 }}>
                    <StockList stocks={filteredStocks} activeStock={activeStock} setActiveStock={setActiveStock} />
                </Scrollbars>
            </Columns.Column>

            <Columns.Column size={8}>
                <StockChart activeStock={activeStock} prices={chartPrices}/>
            </Columns.Column>
        </Columns>

        <ReportView stocks={stocks} />
    </>
    );
}

export default StockView;