import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import CircularProgress from '@material-ui/core/CircularProgress';
import Title from './Title'


export default function RestingHeartRate(props) {
    const [data, setData] = useState(props.heartRateData);

    useEffect(() => {
        setData(props.heartRateData);
    }, [props.heartRateData]);

    if (props.loading) {
        return (<CircularProgress style={{ alignSelf: 'center' }} />);
    } else {
        return (
            <React.Fragment>
                <Title>Resting Heart Rate</Title>
                <ResponsiveContainer height={165}>
                    <LineChart
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
                        <YAxis label={{ value: 'BPM', angle: -90, position: 'insideLeft' }} />
                        <Tooltip position={{ y: 10 }} formatter={(value, name, props) => ([`${value} bpm`])} />
                        <Line connectNulls={true} dataKey='value.restingHeartRate' name='Resting Heart Rate' type='monotone' stroke='#f03b20' fill='#f03b20' />
                    </LineChart>
                </ResponsiveContainer>
            </React.Fragment>
        );
    }
}