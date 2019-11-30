import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import CircularProgress from '@material-ui/core/CircularProgress';
import Title from './Title';

export default function Calories(props) {
    const [loading, setLoading] = useState(props.loading);
    const [data, setData] = useState(props.caloriesBurnedData);

    useEffect(() => {
        setLoading(props.loading);
    }, [props.loading]);

    useEffect(() => {
        setData(props.caloriesBurnedData);
    }, [props.caloriesBurnedData]);

    if (loading) {
        return (<CircularProgress style={{alignSelf: 'center'}} />);
    } else {
        return (
            <React.Fragment>
                <Title>Calories Burned</Title>
                <ResponsiveContainer>
                    <BarChart
                        data={data}
                        margin={{
                            top: 16,
                            right: 16,
                            bottom: 0,
                            left: 24,
                        }}
                    >
                        <XAxis
                            dataKey="dateTime"
                            padding={{ left: 5, right: 5 }}
                        />
                        <YAxis dataKey="value" />
                        <Tooltip
                            formatter={(value, name, props) => [
                                `${value} calories`,
                            ]}
                        />
                        <Bar dataKey="value" fill={props.color} />
                    </BarChart>
                </ResponsiveContainer>
            </React.Fragment>
        );
    }
}
