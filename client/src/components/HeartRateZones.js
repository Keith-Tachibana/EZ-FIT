import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import CircularProgress from '@material-ui/core/CircularProgress';
import Title from './Title'


export default function HeartRateZones(props) {
    const [data, setData] = useState(props.heartRateData);

    useEffect(() => {
        setData(props.heartRateData);
    }, [props.heartRateData]);

    if (props.loading) {
        return (<CircularProgress style={{ alignSelf: 'center' }} />);
    } else {
        return (
            <React.Fragment>
                <Title>Heart Rate Zones</Title>
                <ResponsiveContainer height={165}>
                    <AreaChart
                        data={data}
                        margin={{
                            top: 12,
                            right: 20,
                            bottom: 12,
                            left: 0,
                        }}
                    >
                        <CartesianGrid />
                        <XAxis dataKey="dateTime" />
                        <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                        <Tooltip position={{ y: 10 }} formatter={(value, name, props) => ([`${value} min`, name])} />
                        <Legend />
                        <Area connectNulls={true} dataKey='value.heartRateZones[0].minutes' name='Out of Range' stackId='1' stroke='#fecc5c' fill='#fecc5c' />
                        <Area connectNulls={true} dataKey='value.heartRateZones[1].minutes' name='Fat Burn' stackId='1' stroke='#fd8d3c' fill='#fd8d3c' />
                        <Area connectNulls={true} dataKey='value.heartRateZones[2].minutes' name='Cardio' stackId='1' stroke='#f03b20' fill='#f03b20' />
                        <Area connectNulls={true} dataKey='value.heartRateZones[3].minutes' name='Peak' stackId='1' stroke='#bd0026' fill='#bd0026' />
                    </AreaChart>
                </ResponsiveContainer>
            </React.Fragment>
        );
    }
}