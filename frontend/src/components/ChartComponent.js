import React from 'react';
import { Chart, ArcElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

Chart.register(ArcElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale, Title);

const ChartComponent = ({ type, data, options }) => {
    return (
        <div>
            {type === 'doughnut' && <Doughnut data={data} options={options} />}
            {type === 'bar' && <Bar data={data} options={options} />}
        </div>
    );
};

export default ChartComponent;
