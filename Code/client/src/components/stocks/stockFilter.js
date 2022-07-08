import { Columns, Form } from "react-bulma-components";
import { useEffect, useState } from "react/cjs/react.development";
import { getStockDetails } from "../../utility/stockDetails";

const StockFilter = ({stocks, setStocks}) => {
    const sortTypes = {
        alphaAsc: 'Alphabetical: Ascending',
        alphaDsc: 'Alphabetical: Descending',
        priceAsc: 'Share Price: Ascending',
        priceDsc: 'Share Price: Descending',
        gainsAsc: 'Gains Today: Ascending',
        gainsDsc: 'Gains Today: Descending'
    }

    const filterTypes = {
        all: 'All',
        gains: 'Value: Gains Today',
        losses: 'Value: Losses Today'
    }

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState(filterTypes.all);
    const [sortType, setSortType] = useState(sortTypes.alphaAsc);

    useEffect(() => {
        const searched = search();
        const filtered = filter(searched);
        sort(filtered);
    }, [searchTerm, filterType, sortType])

    const search = () => {
        const term = searchTerm.toLowerCase();

        if(!term) {
            setStocks(stocks);
            return stocks;
        }

        const filteredArr = stocks.filter(stock => {
            const {symbol, company} = stock;

            return symbol.toLowerCase().includes(term)
                || company.toLowerCase().includes(term);
        });

        setStocks(filteredArr);
        return filteredArr;
    }

    const filter = (toFilter) => {
        let filteredArr = toFilter;

        switch (filterType) {
            case filterTypes.gains:
                filteredArr = toFilter.filter((stock) => {
                    return getStockDetails(stock).gains > 0;
                });
                break;
            case filterTypes.losses:
                filteredArr = toFilter.filter((stock) => {
                    return getStockDetails(stock).gains < 0;
                });
                break;
            case filterTypes.all:
            default:
                break;
        }

        setStocks(filteredArr);
        return filteredArr;
    }

    const sort = (toSort) => {
        let sortedArr = toSort;

        switch (sortType) {
            case sortTypes.alphaAsc:
                sortedArr = toSort.slice(0).sort((a,b) => {
                    if(a.symbol < b.symbol) { return -1; }
                    if(a.symbol > b.symbol) { return 1; }
                    return 0;
                });
                break;
            case sortTypes.alphaDsc:
                sortedArr = toSort.slice(0).sort((a,b) => {
                    if(a.symbol > b.symbol) { return -1; }
                    if(a.symbol < b.symbol) { return 1; }
                    return 0;
                });
                break;
            case sortTypes.priceAsc:
                sortedArr = toSort.slice(0).sort((a,b) => {
                    if(a.values.close < b.values.close) { return -1; }
                    if(a.values.close > b.values.close) { return 1; }
                    return 0;
                });
                break;
            case sortTypes.priceDsc:
                sortedArr = toSort.slice(0).sort((a,b) => {
                    if(a.values.close > b.values.close) { return -1; }
                    if(a.values.close < b.values.close) { return 1; }
                    return 0;
                });
                break;
            case sortTypes.gainsAsc:
                sortedArr = toSort.slice(0).sort((a,b) => {
                    const aGains = a.values.gains;
                    const bGains = b.values.gains;

                    if(aGains < bGains) { return -1; }
                    if(aGains > bGains) { return 1; }
                    return 0;
                });
                break;
            case sortTypes.gainsDsc:
                sortedArr = toSort.slice(0).sort((a,b) => {
                    const aGains = a.values.gains;
                    const bGains = b.values.gains;

                    if(aGains > bGains) { return -1; }
                    if(aGains < bGains) { return 1; }
                    return 0;
                });
                break;
            default:
                break;
        }

        setStocks(sortedArr);
    }

    return (
        <>
            <Columns>
                <Columns.Column size={6}>
                    <Form.Input type="search" placeholder="Search" value={searchTerm} onChange={e => { setSearchTerm(e.target.value); }} />
                </Columns.Column>
                <Columns.Column size={3}>
                    <Form.Field horizontal>
                        <Form.Label py={2} pr={1}>Filter: </Form.Label>
                        <Form.Control display="inline">
                            <Form.Select onChange={e => { setFilterType(e.target.value); }}>
                                <option>
                                    {filterTypes.all}
                                </option>
                                <option>
                                    {filterTypes.gains}
                                </option>
                                <option>
                                    {filterTypes.losses}
                                </option>
                            </Form.Select>
                        </Form.Control>
                    </Form.Field>
                </Columns.Column>
                <Columns.Column size={3}>
                    <Form.Field horizontal>
                        <Form.Label py={2} pr={1}>Sort: </Form.Label>
                        <Form.Control color="primary">
                            <Form.Select onChange={e => { setSortType(e.target.value); }}>
                                <option>
                                    {sortTypes.alphaAsc}
                                </option>
                                <option>
                                    {sortTypes.alphaDsc}
                                </option>
                                <option>
                                    {sortTypes.priceAsc}
                                </option>
                                <option>
                                    {sortTypes.priceDsc}
                                </option>
                                <option>
                                    {sortTypes.gainsAsc}
                                </option>
                                <option>
                                    {sortTypes.gainsDsc}
                                </option>
                            </Form.Select>
                        </Form.Control>
                    </Form.Field>
                </Columns.Column>
            </Columns>
            
        </>
    );
}

export default StockFilter;