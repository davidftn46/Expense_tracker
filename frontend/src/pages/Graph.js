import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChartComponent from '../components/ChartComponent';

const Graph = () => {
    const [categoryChartData, setCategoryChartData] = useState(null);
    const [monthlyChartData, setMonthlyChartData] = useState(null);

    useEffect(() => {
        const fetchExpenses = async () => {
            const response = await axios.get('http://localhost:5000/api/expenses');
            const expenses = response.data;

            // Grupisanje troškova po kategorijama
            const categories = expenses.reduce((acc, expense) => {
                acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
                return acc;
            }, {});

            setCategoryChartData({
                labels: Object.keys(categories),
                datasets: [
                    {
                        label: 'Expenses by categories',
                        data: Object.values(categories),
                        backgroundColor: ['#1b5fa0', '#1abc9c', '#d35500', '#faa74a', '#a5a6b7', '#6d6d77', '#3d566f'],
                    },
                ],
            });

            // Grupisanje troškova po mesecima
            const monthly = expenses.reduce((acc, expense) => {
                const month = new Date(expense.date).toLocaleString('default', { month: 'short' });
                acc[month] = (acc[month] || 0) + expense.amount;
                return acc;
            }, {});

            // Lista meseci u hronološkom redosledu
            const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            // Sortiranje meseci prema hronološkom redosledu
            const sortedMonths = monthOrder.filter((month) => monthly[month] !== undefined);
            const sortedValues = sortedMonths.map((month) => monthly[month]);

            setMonthlyChartData({
                labels: sortedMonths,
                datasets: [
                    {
                        label: 'Expenses by months', 
                        data: sortedValues,
                        backgroundColor: '#1b5fa0',
                        borderColor: '#1b5fa0',
                        borderWidth: 1,
                    },
                ],
            });
        };

        fetchExpenses();
    }, []);

    return (
        <div className="charts-container">
            <div className="chart-container">
                {categoryChartData && (
                    <ChartComponent
                        type="doughnut"
                        data={categoryChartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                    labels: {
                                        font: {
                                            family: 'Verdana',
                                            size: 12,
                                            weight: 'bold', 
                                        },
                                        boxWidth: 13, 
                                        boxHeight: 13, 
                                        padding: 12, 
                                    },
                                },
                                title: {
                                    display: true,
                                    text: 'Expenses by categories (in USD)',
                                    font: {
                                        family: 'Verdana',
                                        size: 22,
                                        weight: 'bold', 
                                    },
                                    align: 'center', 
                                },
                            },
                        }}
                    />
                )}
            </div>
            <div className="chart-container">
                {monthlyChartData && (
                    <ChartComponent
                        type="bar"
                        data={monthlyChartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false, 
                            plugins: {
                                legend: { display: false, position: 'top' },
                                title: {
                                    display: true,
                                    text: 'Expenses by months (in USD)',
                                    font: {
                                        family: 'Verdana',
                                        size: 22,
                                        weight: 'bold', 
                                    },
                                    padding: {
                                        top: 0,
                                        bottom: 26,                                         
                                    },
                                    align: 'center', 
                                },
                            },
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default Graph;
