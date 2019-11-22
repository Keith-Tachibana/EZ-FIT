import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import Title from './Title'


export default function Weight(props) {
    const [data, setData] = useState(props.weightData);

    useEffect(() => {
        setData(props.weightData);
    }, [props.weightData]);

    return (
    <React.Fragment>
        <Title>Weight</Title>
        <ResponsiveContainer>
            <AreaChart
                data={data}
                margin={{
                    top: 16,
                    right: 16,
                    bottom: 0,
                    left: 24,
                }}
            >
                <XAxis dataKey="dateTime" />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']}/>
                <Tooltip formatter={(value, name, props) => ( [`${value} lb`] )} />
                <Area dataKey='value' fill='#8884d8' />
            </AreaChart>
        </ResponsiveContainer>
    </React.Fragment>
    );
}