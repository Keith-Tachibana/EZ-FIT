import React, { useState, useEffect } from "react";
import { PieChart, Pie, Label, ResponsiveContainer, Tooltip } from 'recharts';
import Title from './Title'

function CustomLabel({viewBox, value1, value2}){
    const {cx, cy} = viewBox;
    return (
     <text x={cx} y={cy} fill="#3d405c" className="recharts-text recharts-label" textAnchor="middle" dominantBaseline="central">
        <tspan alignmentBaseline="middle" fontSize="26" x="50%">{value1}</tspan>
        <tspan fontSize="14" x="50%" dy="1.5em">{value2}</tspan>
     </text>
    )
  }

export default function StepsGoal() {
    const goal = 10000;
    const steps = 3783;
    const remainingSteps = (goal - steps) < 0 ? 0 : (goal - steps);

    const [data, setData] = useState([
        {name: "Steps", value: steps, fill: '#8884d8'},
        {name: "Remaining Steps", value: remainingSteps, fill: '#eee'},
    ]);


    return (
    <React.Fragment>
        {/* <Title>Steps</Title> */}
        <ResponsiveContainer>
            <PieChart>
                <Pie data={data} dataKey="value" nameKey="name"
                    innerRadius='60%' outerRadius='90%'
                    startAngle={90} endAngle={-270}>
                    <Label width={30} position="center"
                    content={<CustomLabel value1={steps} value2='steps'/>}>
                        {`${steps} steps`}
                    </Label>
                </Pie>
                <Tooltip position={{ x: 0, y: 0 }} />

            </PieChart>
        </ResponsiveContainer>
    </React.Fragment>
    );
}