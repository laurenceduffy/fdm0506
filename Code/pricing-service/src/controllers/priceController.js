import { getStockPrices } from "../data/priceData";

class PriceController {
    constructor() {
        console.log('PriceController initialised');
    }

    getPrices = async (req, res) => {
        const { symbol } = req.params;

        const prices = await getStockPrices(symbol);
        
        return res.status(200).json(prices);
    }
}

export default new PriceController();