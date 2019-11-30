import React, { useState, useEffect } from "react";
import { PieChart, Pie, Label, ResponsiveContainer, Tooltip } from 'recharts';
import CircularProgress from '@material-ui/core/CircularProgress';

function CustomLabel({viewBox, value1, value2}){
    const {cx, cy} = viewBox;
    let textColor = '';
    if (value1 < 18.5) {
        textColor = '#4dbfbf';
    } else if (value1 < 25) {
        textColor = '#A2D704';
    } else if (value1 < 30) {
        textColor = '#ffd300';
    } else {
        textColor = '#fe951b';
    }
    return (
     <text x={cx} y={cy} fill="#3d405c" className="recharts-text recharts-label" textAnchor="middle" dominantBaseline="central">
        <tspan alignmentBaseline="middle" fontSize="22" x="50%">{`BMI: ${value1}`}</tspan>
        <tspan fontSize="24" x="50%" dy="1.5em" style={{fill: textColor}}>{value2}</tspan>
     </text>
    )
}

export default function BMI(props) {

    function getBMICategory(currentBMI) {
        if (currentBMI < 18.5){
            return "Underweight";
        } else if (currentBMI < 25){
            return "Normal";
        } else if (currentBMI < 30){
            return "Overweight";
        } else {
            return "Obese";
        }
    }

    function calculateGaugePercent(currentBMI){
        if (currentBMI < 18.5){
            return (currentBMI / 18.5) * 25;
        } else if (currentBMI < 25){
            return 25 + ((currentBMI - 18.5) / 6.5) * 25;
        } else if (currentBMI < 30){
            return 50 + ((currentBMI - 25) / 5.0) * 25;
        } else {
            return Math.min(100, 75 + ((currentBMI - 30) / 10.0 * 25));
        }
    }

    const [loading, setLoading] = useState(props.loading);
    const [data, setData] = useState([
        {name: "Percentage", value: calculateGaugePercent(props.current), fill: '#eee'},
        {name: "Remaining Percent", value: 100 - calculateGaugePercent(props.current), fill: '#eee'},
    ]);

    useEffect(() => {
        setLoading(props.loading);
    }, [props.loading]);

    useEffect(() => {
        const gaugePercent = calculateGaugePercent(props.current);
        // console.log(gaugePercent);
        let gaugeColor = "#eee";

        if (gaugePercent < 25) {
            gaugeColor = '#4dbfbf';
        } else if (gaugePercent < 50) {
            gaugeColor = '#A2D704';
        } else if (gaugePercent < 75) {
            gaugeColor = '#ffd300';
        } else {
            gaugeColor = '#fe951b';
        }
        setData([
            {name: "Percentage", value: gaugePercent, fill: gaugeColor},
            {name: "Remaining Percent", value: 100 - gaugePercent, fill: '#eee'},
        ]);
    }, [props.current]);

    if (loading) {
        return (<CircularProgress style={{alignSelf: 'center'}} />);
    } else {
        return (
            <React.Fragment>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name"
                            innerRadius='60%' outerRadius='90%'
                            startAngle={180} endAngle={0}>
                            <Label width={30} position="center"
                            content={<CustomLabel value1={props.current.toFixed(1)} value2={getBMICategory(props.current)} />} />
                        </Pie>
        
                    </PieChart>
                </ResponsiveContainer>
            </React.Fragment>
        );
    }
}