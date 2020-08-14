"use strict"

$(document).ready(() => {
    const ctx = document.getElementById('chart').getContext('2d');

    const createChart = (labels, data) => {
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    borderColor: 'rgb(197, 151, 157)',
                    borderWidth:1,
                    pointRadius:1,
                    data: data
                }]
            },
            options: {scales:{
                yAxes:[{gridLines:{zeroLineColor:'transparent', display:false}, ticks:{fontColor: "rgba(0,0,0,0.8)", precision:0, suggestedMax:10, beginAtZero: true, fontFamily:'Quicksand'}}],
                xAxes:[{gridLines:{zeroLineColor:'transparent', display:false}, ticks:{fontColor: "rgba(0,0,0,0.8)", beginAtZero: true, fontFamily:'Quicksand'}}],
            }, legend:{display:false}}
        })
    }

    const labels = [];
    const data = [];
    const chartKeys = $('.chart__key');
    
    chartKeys.each(function() {
        const [key, value] = $(this).text().split('-');
        labels.push(key);
        data.push(value);
    })

    createChart(labels, data);

})
