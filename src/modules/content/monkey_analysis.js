import jQuery from 'jquery';
import * as echarts from 'echarts';

let interval = 0;
let memoryList = [];
const runAnalysis = () => {
    let minMemory = 0;
    let maxMemory = 0;

    // 内存图
    const memoryChart = document.createElement('div');
    memoryChart.className = 'memoryChart';
    memoryChart.id = 'memoryChart';
    document.getElementById('monkeyAnalysis').appendChild(memoryChart);
    const chartDom = document.getElementById('memoryChart');
    const myChart = echarts.init(chartDom);

    // 内存监控
    const memoryDesc = document.createElement('div');
    memoryDesc.className = 'memoryDesc';
    memoryDesc.id = 'memoryDesc';
    document.getElementById('monkeyAnalysis').appendChild(memoryDesc);
  
    interval = setInterval(() => {
        const memory = Number((window.performance.memory.usedJSHeapSize / 1048576).toFixed(2));
        if (memory > maxMemory) {
            maxMemory = memory;
        } else if (memory < minMemory || minMemory === 0) {
            minMemory = memory;
        }
        memoryList.push(memory);
        if (memoryList.length > 10) {
            memoryList.shift();
        }
        const option = {
            xAxis: {
                type: 'category',
                boundaryGap: false,
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    data: memoryList,
                    type: 'line',
                    areaStyle: {},
                },
            ],
        };
        myChart.setOption(option);
        jQuery('#memoryDesc').html(`内存占用：${memory}MB，最大：${maxMemory}MB，最小：${minMemory}MB`);
    }, 1000);
};

const stopAnalysis = () => {
    clearInterval(interval);
};

export {
    runAnalysis,
    stopAnalysis,
};
