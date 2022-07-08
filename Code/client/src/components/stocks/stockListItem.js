import { Columns, Notification, Heading } from "react-bulma-components";
import getCurrencyString from "../../utility/currencyFormatting";
import { gainsPrefix, gainsColor } from "../../utility/gainsFormatting";

const StockListItem = ({details, activeStock, setActiveStock}) => {
    const isActive = activeStock && activeStock.symbol === details.symbol;

    return (
        <Columns.Column size={12} key={details.symbol} style={{width:360}} backgroundColor="light">
            <Notification className="p-4 has-text-left" onClick={async () => {setActiveStock(details)}} color="white" className="is-clickable" style={isActive ? {border: "solid", borderWidth: "0px 3px", borderColor: "turquoise"} : {border: "solid", borderWidth: "0px 3px",borderColor: "grey"}}>
                <Columns>
                    <Columns.Column size={7}>
                        <Heading size="5">{details.symbol}</Heading>
                        <Heading size="6" subtitle={true}>{details.company}</Heading>
                    </Columns.Column>
                    <Columns.Column size={5}>
                        <Heading size="5" className="has-text-primary">{getCurrencyString(details.close)}</Heading>
                        <Heading size="6" subtitle={true} className={`has-text-${gainsColor(details.gains)}`}>({gainsPrefix(details.gains)}{details.gains.toFixed(3)}%)</Heading>
                    </Columns.Column>
                </Columns>
            </Notification>
        </Columns.Column>
    );
}

export default StockListItem;