import React, { useState, useEffect } from "react";
import { PieChart, Pie, Label, ResponsiveContainer, Tooltip } from 'recharts';
import CircularProgress from '@material-ui/core/CircularProgress';

function CustomLabel({viewBox, value1, value2}){
    const {cx, cy} = viewBox;
    return (
     <text x={cx} y={cy} fill="#3d405c" className="recharts-text recharts-label" textAnchor="middle" dominantBaseline="central">
        <tspan alignmentBaseline="middle" fontSize="26" x="50%">{value1}</tspan>
        <tspan fontSize="14" x="50%" dy="1.5em">{value2}</tspan>
     </text>
    )
  }

export default function CaloriesGoal(props) {
    const remainingCalories = (props.goal - props.current) < 0 ? 0 : (props.goal - props.current);

    const [loading, setLoading] = useState(props.loading);
    const [data, setData] = useState([
        {name: "Calories", value: props.current, fill: props.color},
        {name: "Remaining Calories", value: remainingCalories, fill: '#eee'},
    ]);

    useEffect(() => {
        setLoading(props.loading);
    }, [props.loading]);

    useEffect(() => {
        setData([
            {name: "Calories", value: props.current, fill: props.color},
            {name: "Remaining Calories", value: remainingCalories, fill: '#eee'},  
        ]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.current, props.goal]);

    if (loading) {
        return (<CircularProgress style={{alignSelf: 'center'}} />);
    } else {
        return (
            <React.Fragment>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name"
                            innerRadius='60%' outerRadius='90%'
                            startAngle={90} endAngle={-270}>
                            <Label width={30} position="center"
                            content={<CustomLabel value1={props.current} value2='calories'/>}>
                                {`${props.current} Calories`}
                            </Label>
                        </Pie>
                        <Tooltip position={{ x: 0, y: 0 }} />
        
                    </PieChart>
                </ResponsiveContainer>
            </React.Fragment>
        );
    }
}