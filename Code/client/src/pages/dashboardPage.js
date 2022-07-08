import { useEffect } from "react";
import { Box, Heading } from "react-bulma-components";
import { useState } from "react/cjs/react.development";
import { getAllSymbols, getStockData } from "../api/stocks";
import { useToken } from "../auth/useToken";
import StockView from "../components/stocks/stockView";

const Dashboard = () => {
    const [token,] = useToken();
    const [stockData, setStockData] = useState([]);

    const initialiseStockData = async () => {
        const symbols = await getAllSymbols();
        

        if(symbols) {
            const tmpData = [];

            for (let i = 0; i < symbols.length; i++) {
                const symbol = symbols[i];
                const data = await getStockData(symbol);

                if (data) {
                    tmpData.push(data);
                }
            }

            setStockData(tmpData);
        }
    }

    useEffect(() => {
        initialiseStockData();
    }, [token]);

    return (
        <>
            <Box style={{maxWidth:1200, margin:'auto'}}>
                <Heading color="dark" size="4" subtitle={false}>Trading Dashboard</Heading>
    
                {stockData.length === 0 ?
                    <p>Loading...</p>
                :
                    <StockView title={"Stock List"} stocks={stockData} />
                }
            </Box>
            
        </>
    );
};

export default Dashboard;