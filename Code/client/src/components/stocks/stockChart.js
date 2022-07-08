import { useEffect, useState } from "react";
import { Notification } from "react-bulma-components";
import { Bar, Line } from "react-chartjs-2";
import { chartColor } from "../../utility/gainsFormatting";
import ChartFooter from "./stockChartFooter";
import ChartHeader from "./stockChartHeader";

const CHART_POINT_COUNT = 115; 
const TODAY = new Date(new Date().setHours(0,0,0,0));

const lineOptions = {
    scales: {
        y: {
            beginAtZero: false,
            ticks: {
                display: false
            }
        },
        x: {
            stacked: true,
            ticks: {
                display: false
            }
        }
    },
    plugins: {
        legend: {
          display: false
        },
        title: {
            display: true,
            text: 'Value'
        }
    },
    elements: {
        point:{
            radius: 2
        }
    },
    tooltips: {
        filter: function (tooltipItem) {
            console.log(tooltipItem);
            return tooltipItem.datasetIndex !== 1;
        }
    },
    animation: false
  };

const barOptions = {
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                display: false
            }
        },
        x: {
            ticks: {
                display: false
            }
        }
    },
    plugins: {
        legend: {
            display: false
        },
        title: {
            display: true,
            text: 'Volume'
        }
    }
};

const StockChart = ({activeStock, prices}) => {
    const [priceDataset, setPriceDataset] = useState(null);
    const [volumeDataset, setVolumeDataset] = useState(null);
    
    const chartData = prices.slice(-CHART_POINT_COUNT);

    const updateChartData = () => {
        if(chartData.length === 0) {
            setPriceDataset(null);
            setVolumeDataset(null);
            return;
        };

        const todayData = [];
        const prevData = [];
        
        chartData.map(data => {
            if(new Date(data.datetime) > TODAY) {
                todayData.push(data.value);
            } else {
                prevData.push(data.value);
                todayData.push(null);
            }
        });
    
        const priceData = {
            labels: chartData.map(data => {return data.datetime}),
            datasets: [
                {
                    data: prevData.map(data => {return data}),
                    fill: false,
                    backgroundColor: 'grey',
                    borderColor: 'grey',
                },
                {
                    data: todayData.map(data => { return data }),
                    fill: false,
                    backgroundColor: chartColor(activeStock.gains),
                    borderColor: chartColor(activeStock.gains),
                },
            ],
        };
    
        const volumeData = {
            labels: chartData.map(data => {return data.datetime}),
            datasets: [
                {
                    data: chartData.map(data => {return data.volume}),
                    fill: true,
                    backgroundColor: 'white',
                    borderColor: 'white',
                },
            ],
        }

        setPriceDataset(priceData);
        setVolumeDataset(volumeData);
    }

    useEffect(() => {
        updateChartData();
    }, [prices])

    return (
        <>
            {activeStock && priceDataset && volumeDataset ? <>
                <Notification color="light" style={{height: 600}} className="p-0 ml-3">
                    <ChartHeader details={activeStock} height="15%" />

                    <Notification className="is-radiusless m-0" color="dark" style={{height:"50%", border:"solid", borderWidth: "1px 0px", borderColor:chartColor(activeStock.gains)}}>
                        <Line data={priceDataset} options={lineOptions} height="80%" redraw/>
                        <Bar data={volumeDataset} options={barOptions} height="40%" redraw/>
                    </Notification>

                    <ChartFooter details={activeStock} height="25%"/>
                </Notification>
            </> : <></>}
        </>
    );
}

export default StockChart;