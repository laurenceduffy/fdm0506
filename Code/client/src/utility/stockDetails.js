const getStockDetails = stock => {
    const stockDetails = {
        symbol: stock.symbol,
        company: stock.company,
        open: stock.values.open,
        close: stock.values.close,
        high: stock.values.high,
        low: stock.values.low,
        gains: stock.values.gains
    }

    return stockDetails;
}

export { getStockDetails };