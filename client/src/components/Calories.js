import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import Title from './Title'


export default function Calories() {
    const [data, setData] = useState([
        {"dateTime":"2011-04-27","value":5490},
        {"dateTime":"2011-04-28","value":2344},
        {"dateTime":"2011-04-29","value":2779},
        {"dateTime":"2011-04-30","value":9196},
        {"dateTime":"2011-05-01","value":15828},
        {"dateTime":"2011-05-02","value":1945},
        {"dateTime":"2011-05-03","value":366},
        {"dateTime":"2011-05-04","value":10102},
        {"dateTime":"2011-05-05","value":803},
        {"dateTime":"2011-05-06","value":450},
        {"dateTime":"2011-05-07","value":2010},
        {"dateTime":"2011-05-08","value":1600},
        {"dateTime":"2011-05-09","value":5050},
        {"dateTime":"2011-05-10","value":300},
        {"dateTime":"2011-05-11","value":11020},
        {"dateTime":"2011-05-12","value":1800},
        {"dateTime":"2011-05-13","value":1472},
        {"dateTime":"2011-05-14","value":3414},
        {"dateTime":"2011-05-15","value":9752},
        {"dateTime":"2011-05-16","value":4542},
        {"dateTime":"2011-05-17","value":121},
        {"dateTime":"2011-05-18","value":12452},
        {"dateTime":"2011-05-19","value":10101},
        {"dateTime":"2011-05-20","value":2457},
        {"dateTime":"2011-05-21","value":242},
        {"dateTime":"2011-05-22","value":3671},
        {"dateTime":"2011-05-23","value":214},
        {"dateTime":"2011-05-24","value":707},
        {"dateTime":"2011-05-25","value":247},
        {"dateTime":"2011-05-26","value":2101},
        {"dateTime":"2011-05-27","value":14080},
    ]);


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
                <XAxis dataKey="dateTime" />
                <YAxis />
                <Tooltip formatter={(value, name, props) => ( [`${value} calories`] )} />
                <Bar dataKey='value' fill='#8884d8'>

                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </React.Fragment>
    );
}