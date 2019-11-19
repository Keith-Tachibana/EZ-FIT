import React, { useState, useEffect } from "react";
import { Bar } from 'react-chartjs-2'


export default function Steps() {
    const [data, setData] = useState({
        labels: ['2011-04-27', '2011-04-28', '2011-04-29', '2011-04-30', '2011-05-01', '2011-05-02', '2011-05-03'],
        datasets: [{
            label: 'Calories burned',
            data: [5490, 2344, 2779, 9196, 15828, 1945, 366],
            backgroundColor: '#8884d8',
            borderColor: '#8884d8',
            borderWidth: 1
        }]
    });


    return (
    <div>
        <Bar data={data} height={200}
        options={{ maintainAspectRatio: false, responsive: true }}/>
    </div>
    );
}