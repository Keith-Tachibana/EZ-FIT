import React, { useState, useEffect } from "react";
import { PieChart, Pie, Label, ResponsiveContainer, Tooltip } from 'recharts';
import Title from "./Title";

function CustomLabel({viewBox, value1, value2, value3}){
    const {cx, cy} = viewBox;
    return (
     <text x={cx} y={cy} fill="#3d405c" className="recharts-text recharts-label" textAnchor="middle" dominantBaseline="central">
        <tspan alignmentBaseline="middle" fontSize="22" x="50%">{`${value1} lb`}</tspan>
        <tspan fontSize="24" x="50%" dy="1.25em">{`Start: ${value2} lb`}</tspan>
        <tspan fontSize="24" x="50%" dy="1.25em">{`Goal: ${value3} lb`}</tspan>
     </text>
    )
  }

export default function WeightGoal(props) {
    const remainingWeight = props.goal - props.current;

    const [data, setData] = useState([
        {name: "Weight", value: props.current, fill: '#8884d8'},
        {name: "Remaining Weight", value: Math.abs(remainingWeight), fill: '#eee'},
    ]);

    useEffect(() => {
        let current = props.current - props.start;
        if (props.goalType === "GAIN"){
            current = current < 0 ? 0 : current;
        } else {
            current = current > 0 ? 0 : Math.abs(current);
        }
        setData([
            {name: "Weight", value: current, fill: '#8884d8'},  
            {name: "Remaining Weight", value: Math.abs(remainingWeight), fill: '#eee'},
        ]);
    }, [props.goalType, props.start, props.current, props.goal]);

    if (!props.goalType || !props.start || !props.current || !props.goal){
        return <Title>No Weight Goal Set</Title>
    } else {
        return (
            <React.Fragment>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name"
                            innerRadius='60%' outerRadius='90%'
                            startAngle={180} endAngle={0}>
                            <Label width={30} position="center"
                            content={<CustomLabel value1={props.current} value2={props.start} value3={props.goal} />}>
                                {`${props.current} lbs`}
                            </Label>
                        </Pie>
                        <Tooltip position={{ x: 0, y: 0 }} />
        
                    </PieChart>
                </ResponsiveContainer>
            </React.Fragment>
            );
    }
}