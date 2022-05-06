import jQuery from 'jquery';
import * as echarts from 'echarts';

let timerInterval = 0;
let hour = 0;
let minute = 0;
let second = 0;
const startTimer = () => {
    // 计时器
    const timer = document.createElement('div');
    timer.className = 'timer';
    timer.id = 'timer';
    document.getElementById('monkeyAnalysis').appendChild(timer);
    timerInterval = setInterval(() => {
        if (second === 59) {
            second = 0;
            if (minute === 60) {
                minute = 0;
                hour++;
            } else {
                minute++;
            }
        } else {
            second++;
        }
        jQuery('#timer').html(`已测试
            ${hour > 0 ? hour + '小时' : ''} 
            ${minute > 0 ? minute + '分钟' : ''} 
            ${second > 0 ? second + '秒' : ''}`);
    }, 1000);
};

const stopTimer = () => {
    clearInterval(timerInterval);
};

export { startTimer, stopTimer };
