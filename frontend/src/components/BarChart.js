import React, { useEffect } from 'react';
import Chart from 'chart.js';

const BarChart = ({id, names, data, dataLabel, len }) => {
    
    useEffect(() => {
        var backgroundColors = [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
        ];
    
        var borderColors = [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ];
    
        backgroundColors.splice(0, len);
        borderColors.splice(0, len);
    
        var barChart = new Chart(id, {
            type: 'bar',
            data: {
                labels: names,
                datasets: [{
                    label: dataLabel,
                    data: data,
                    backgroundColor: [...backgroundColors],
                    borderColor: [...borderColors],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    });

    return(
        <canvas id={`${id}`} />
    );
}
export default BarChart; 