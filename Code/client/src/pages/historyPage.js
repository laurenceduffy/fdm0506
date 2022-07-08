import { Box, Button, Heading } from "react-bulma-components";
import { useEffect, useState } from "react/cjs/react.development";
import { get } from "../api/transactions";
import { useToken } from '../auth/useToken';
import getCurrencyString from "../utility/currencyFormatting";

const HistoryPage = () => {
    const DEFAULT_MAX_ITEMS = 15;
    const MAX_ITEM_INCREMENT = 5;

    const [token,] = useToken();
    const [transactions, setTransactions] = useState([]);
    const [transactionItems, setTransactionItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [maxItems, setMaxItems] = useState(DEFAULT_MAX_ITEMS);

    const showMore = () => {
        const newMax = maxItems + MAX_ITEM_INCREMENT;

        if(newMax < transactions.length) {
            setMaxItems(newMax);
        } else {
            setMaxItems(transactions.length)
        }
    }

    const getTransactions = async() => {
        const response = await get(token);
        setIsLoading(true)
        setTransactions(response);
        setIsLoading(false);
    }

    useEffect(() => {
        if(transactions.length === 0 && !isLoading) {
            getTransactions();
        }
    })

    useEffect(() => {
        const itemCount = isNaN(maxItems) ? DEFAULT_MAX_ITEMS : maxItems;
        const sliced = transactions.slice(0,itemCount);
        const items = sliced.map(data => {
            const type = data.type === 0 ? 'Bought' : 'Sold';
            const price = getCurrencyString(data.price);
            const date = data.timestamp.split('T')[0];

            const timeStr = data.timestamp.split('T')[1];
            const time = timeStr.substring(0, timeStr.length - 5);

            return (
            <div key={data.timestamp} style={{display: "block"}}>
                <Heading size={6} subtitle={true} style={{display: "inline-block"}} mr={2}>{date} - {time}</Heading>
                <Heading mb={4} size={5} style={{display: "inline-block"}}>{type} {data.stock} for {price}</Heading>
            </div>);
        });

        setTransactionItems(items);
    }, [transactions, maxItems])

    return (
        <>
            <Box style={{maxWidth:1200, margin:'auto'}}>
                <Heading color="dark" size="4" subtitle={false}>Transaction History</Heading>
                
                {isLoading ? <p>Loading...</p> : (
                    <>
                        <div>{transactionItems}</div>
                        <Button onClick={showMore} color="ghost">Show More...</Button>
                        <Heading subtitle={true} size={6} color="dark" textWeight="light">Showing {isNaN(maxItems) ? DEFAULT_MAX_ITEMS : maxItems} Results.</Heading>
                    </>
                )}
            </Box>
        </>
    );
};

export default HistoryPage;