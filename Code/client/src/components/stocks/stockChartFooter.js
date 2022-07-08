import { Level, Button, Form } from "react-bulma-components";
import BuyModal from "../modals/buyModal";
import SellModal from "../modals/sellModal";
import { useState } from "react";
import getCurrencyString from "../../utility/currencyFormatting";
import { useToken } from "../../auth/useToken";
import { accountShares, getAccountShares } from "../../api/account";
import { useEffect } from "react/cjs/react.development";
import { useAdmin } from "../../auth/useAdmin";
import CompanyDetailsModal from "../modals/companyDetailsModal";
import DeleteCompanyModal from "../modals/deleteCompanyModal";

const ChartFooter = ({details, height}) => {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const [buyModalOpen, setBuyModalOpen] = useState(false);
    const [sellModalOpen, setSellModalOpen] = useState(false);
    const [userStockInfo, setUserStockInfo] = useState({
        sharesOwned: 0,
        sharesValue: 0,
        currentProfit: 0,
        gains: 0,
        priceAverage: 0
    });
    const [token,] = useToken();
    const [adminToken,] = useAdmin();

    const getUserStockInfo = async() => {
        if(token) {
            const shares = await getAccountShares(token, details.symbol);
            setUserStockInfo({
                sharesOwned: shares.amount,
                sharesValue: details.close * shares.amount,
                currentProfit: shares.amount > 0 ? (details.close - shares.avgPrice) * shares.amount : 0,
                gains: shares.amount > 0 ? ((details.close - shares.avgPrice) / shares.avgPrice).toFixed(3) : 0,
                priceAverage: shares.avgPrice
            });
        }
    }
    
    useEffect(() => {
        accountShares.reset();
    }, [buyModalOpen, sellModalOpen])

    useEffect(() => {
        getUserStockInfo();
    }, [accountShares.data, details.symbol]);

    

    const getValue = val => {
        if(val === 0) {
            return '-';
        }

        return val;
    }

    return ( 
        <>
        <Level className="has-text-centered m-0 pb-5" style={{height:height}}>
            {adminToken ? <>
                <Level.Item>
                    <div>
                        <p className="heading">Position Information Unavailable in Admin Mode</p>
                    </div>
                </Level.Item>
                
                <Level.Side className="mx-4" align="right">
                    <Level.Item>
                        <Form.Field kind="addons" align="right">
                            <Form.Control>
                                <Button color="primary" onClick={() => { setEditModalOpen(true) }}>
                                    Edit
                                </Button>
                            </Form.Control>
                            <Form.Control>
                                <Button color="danger" onClick={() => { setDeleteModalOpen(true) }}>
                                    Delete
                                </Button>
                            </Form.Control>
                        </Form.Field>
                    </Level.Item>
                </Level.Side>
            </> : <>
            <Level.Item>
                <div>
                    <p className="heading">Shares Owned</p>
                    <p className="subtitle is-bold">{getValue(userStockInfo.sharesOwned)}</p>
                </div>
            </Level.Item>

            <Level.Item>
                <div>
                    <p className="heading">Current Value</p>
                    <p className="subtitle is-bold">{getCurrencyString(getValue(userStockInfo.sharesValue))}</p>
                </div>
            </Level.Item>

            <Level.Item>
                <div>
                    <p className="heading">Current Profit</p>
                    <p className="subtitle is-bold">{getCurrencyString(getValue(userStockInfo.currentProfit))}</p>
                </div>
            </Level.Item>

            <Level.Item>
                <div>
                    <p className="heading">Gains</p>
                    <p className="subtitle is-bold">{`${getValue(userStockInfo.gains)}%`}</p>
                </div>
            </Level.Item>

            <Level.Item>
                <div>
                    <p className="heading">Price Average</p>
                    <p className="subtitle is-bold">{getValue(getCurrencyString(userStockInfo.priceAverage))}</p>
                </div>
            </Level.Item>

            <Level.Side className="mx-4" align="right">
                <Level.Item>
                    <Form.Field kind="addons" align="right">
                        <Form.Control>
                            <Button color="success" onClick={() => { setBuyModalOpen(true) }}>
                                BUY
                            </Button>
                        </Form.Control>
                        <Form.Control>
                            <Button color="danger" onClick={() => { setSellModalOpen(true) }} disabled={userStockInfo.sharesOwned === 0}>
                                SELL
                            </Button>
                        </Form.Control>
                    </Form.Field>
                </Level.Item>
            </Level.Side>
            </>}
        </Level>

        {adminToken ?
        <>
            <CompanyDetailsModal open={editModalOpen} setOpen={setEditModalOpen} stock={{symbol: details.symbol, company: details.company}} editMode/>
            <DeleteCompanyModal open={deleteModalOpen} setOpen={setDeleteModalOpen} symbol={details.symbol} />
        </> :
        <>
            <BuyModal open={buyModalOpen} setOpen={setBuyModalOpen} stock={{name: details.symbol, price: details.close}} onSubmit={getUserStockInfo} />
            <SellModal open={sellModalOpen} setOpen={setSellModalOpen} stock={{name: details.symbol, price: details.close}} sharesOwned={userStockInfo.sharesOwned} onSubmit={getUserStockInfo} />
        </>
        }
        </>
    );
}

export default ChartFooter;