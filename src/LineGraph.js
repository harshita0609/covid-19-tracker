import React , { useState, useEffect } from 'react';
import { Line } from "react-chartjs-2";
import numeral from "numeral";
const options={
    legend:{
        display:false,
    },
    elements:{
        point:{
            radius:0,
        },
    },
    maintainAspectRatio:false,
    tooltips:{
        mode:"index",
        intersect:false,
        callbacks:{
            label: function(tooltipItem,data){
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales:{
        xAxes:[
            {
                type:"time",
                time:{
                    format:"MM/DD/YY",
                    tooltipFormat:"ll",
                },
            },
        ],
        yAxes:[{
            gridLines: {
                display:false,
            },
            ticks:{
                callback:function(value,index,values){
                    return numeral(value).format("0a");
                },
            },
        },
        ],
    }

}
const buildChartData = (data,casesType) =>{
    const chartData=[];
    let lastDataPoint;

    for(let date in data.cases){
        if(lastDataPoint){
            let newDataPoint={
                x: date,
                y: data[casesType][date] - lastDataPoint
                //bcoz we want new cases for today
            };
            chartData.push(newDataPoint);
           
        }
        lastDataPoint= data[casesType][date];
    }
    return chartData;
};

function LineGraph({casesType="cases",...props}) {
    const [data,setData]= useState({});

    //https://disease.sh/v3/covid-19/historical/all?lastdays=120

    
    useEffect(() => {
        const fetchData = async () => {
         await   fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
        .then(response=> { return response.json();})
        .then((data)=> {
            
            let chartData = buildChartData(data, casesType);
            // console.log(chartData);
            setData(chartData);
        });
        };
        fetchData();
    }, [casesType]);

    
    return (
        <div className={props.className}>
            {/* <h1>i am a graph</h1> */}
            {data?.length >0 && (
                <Line 
                    options={options}
                    data ={{
                        datasets:[{
                            data:data,
                            backgroundColor:"rgba(204,16,52,0.5)",
                            borderColor:"#CC1034",
                        },
                    ],
                    }}

                />
            )}
            
        </div>
    )
}

export default LineGraph
