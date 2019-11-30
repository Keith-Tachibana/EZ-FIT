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

export default function DistanceGoal(props) {
    const remainingDistance = (props.goal - props.current) < 0 ? 0 : (props.goal - props.current);

    const [loading, setLoading] = useState(props.loading);
    const [data, setData] = useState([
        {name: "Distance", value: props.current, fill: props.color},
        {name: "Remaining Distance", value: remainingDistance, fill: '#eee'},
    ]);

    useEffect(() => {
        setLoading(props.loading);
    }, [props.loading]);

    useEffect(() => {
        setData([
            {name: "Distance", value: props.current, fill: props.color},
            {name: "Remaining Distance", value: remainingDistance, fill: '#eee'},
        ]);
    }, [props.current, props.goal]);

    if (loading) {
        return (<CircularProgress style={{alignSelf: 'center'}} />);
    } else {
        return (
            <React.Fragment>
                { loading && <CircularProgress /> }
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name"
                            innerRadius='60%' outerRadius='90%'
                            startAngle={90} endAngle={-270}>
                            <Label width={30} position="center"
                            content={<CustomLabel value1={props.current} value2='miles'/>}>
                                {`${props.current} miles`}
                            </Label>
                        </Pie>
                        <Tooltip position={{ x: 0, y: 0 }} formatter={(value, name, props) => ( [`${value.toPrecision(2)} miles`, name] )} />
        
                    </PieChart>
                </ResponsiveContainer>
            </React.Fragment>
        );
    }
}