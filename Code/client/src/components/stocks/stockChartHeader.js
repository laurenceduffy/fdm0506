import { Level } from "react-bulma-components";
import getCurrencyString from "../../utility/currencyFormatting";
import { gainsColor, gainsPrefix } from "../../utility/gainsFormatting";
const ChartHeader = ({details, height}) => {
    return (
        <>
        <Level className="has-text-centered m-0" style={{height:height}}>
            <Level.Item>
                <div>
                    <p className="heading">Symbol</p>
                    <p className="subtitle is-bold is-uppercase">{details.symbol}</p>
                </div>
            </Level.Item>
            <Level.Item>
                <div>
                    <p className="heading">Company</p>
                    <p className="subtitle is-bold is-uppercase">{details.company}</p>
                </div>
            </Level.Item>
        </Level>

        <Level className="has-text-centered m-0" style={{height:height}}>
            <Level.Item>
                <div>
                    <p className="heading">Current / Close Price</p>
                    <p className="subtitle is-bold has-text-primary">{getCurrencyString(details.close)}</p>
                </div>
            </Level.Item>
            <Level.Item>
                <div>
                    <p className="heading">Open Price</p>
                    <p className="subtitle is-bold">{getCurrencyString(details.open)}</p>
                </div>
            </Level.Item>
            <Level.Item>
                <div>
                    <p className="heading">Highest Price</p>
                    <p className="subtitle is-bold is-uppercase">{getCurrencyString(details.high)}</p>
                </div>
            </Level.Item>
            <Level.Item>
                <div>
                    <p className="heading">Lowest Price</p>
                    <p className="subtitle is-bold is-uppercase">{getCurrencyString(details.low)}</p>
                </div>
            </Level.Item>
            <Level.Item>
                <div>
                    <p className="heading">Gains Today</p>
                    <p className={`subtitle is-bold has-text-${gainsColor(details.gains)}`}>{gainsPrefix(details.gains)}{details.gains.toFixed(3)}%</p>
                </div>
            </Level.Item>
        </Level>
        </>
        
    );
};

export default ChartHeader;