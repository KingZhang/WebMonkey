import { addPageScript } from 'appRoot/common/utils';
import { CMD_RUN_MONKEY, CMD_STOP_MONKEY } from 'appRoot/common/constants';
import { eventList } from 'appRoot/common/mouseEvents';
import { elementEventList } from 'appRoot/common/elementEvents';
import Chance from 'chance';
import jQuery from 'jquery';
import { runAnalysis, stopAnalysis } from './monkey_analysis';
import { startTimer, stopTimer } from './timer';
import './content.less';

addPageScript('js/inner.js');
const chance = new Chance();

let horde;
let stopTimeout = 0;
let tabInterval = 0;

function runByConfig(config) {
    if (!config) {
        alert('请先配置测试策略！');
        return;
    }

    // 隐藏元素
    hideElement(config);

    // 运行模式
    if (config.mode === 'mouseMode') {
        runMouseMode(config);
    } else {
        runElementMode(config);
    }

    // 开启monkey分析
    const monkeyAnalysis = document.createElement('div');
    monkeyAnalysis.className = 'monkeyAnalysis';
    monkeyAnalysis.id = 'monkeyAnalysis';
    document.body.appendChild(monkeyAnalysis);
    runAnalysis();
    // 开启计时
    startTimer();

    // 停止monkey
    const { durationHour = 0, durationMinute = 0 } = config;
    if (durationHour || durationMinute) {
        setTimeout(
            stopMonkey,
            durationHour * 60 * 60 * 1000 + durationMinute * 60 * 1000,
        );
    }
}

/**
 * 根据配置隐藏对应元素
 * 
 * @param {*} config 
 */
function hideElement(config) {
    const { hiddenElements = [] } = config;
    hiddenElements.forEach((item) => {
        const { type, value } = item;
        if (type === 'id') {
            jQuery(`#${value}`).hide();
        } else if (type === 'class') {
            jQuery(`.${value}`).hide();
        }
    });
}

/**
 * 运行鼠标随机模式
 * 
 * @param {*} config 
 */
function runMouseMode(config) {
    const { event } = config;
    const species = eventList
        .map((item) => {
            if (event.includes(item.key)) {
                return item.action;
            }
        })
        .filter((item) => item);

    if (horde) {
        horde.stop();
    }

    horde = gremlins.createHorde({
        species,
        mogwais: [
            gremlins.mogwais.alert(),
            //gremlins.mogwais.fps(),
            gremlins.mogwais.gizmo(),
        ],
        //strategies: [gremlins.strategies.distribution()],
        strategies: [gremlins.strategies.allTogether({ nb: Number.MAX_VALUE })],
    });
    horde.unleash();
}

/**
 * 通过配置读取所有元素随机移动和触发事件
 * 
 * @param {*} config 
 */
function runElementMode(config) {
    const {
        elementEvent = ['click', 'input'],
        elements = ['[tabindex]', 'input', 'select', 'a'],
        elementExt = [],
        maskElements = [],
    } = config;
    // get top element
    let topElement = null;
    document.addEventListener('touchstart', (event) => {
        event.preventDefault();
        event.stopPropagation();
        topElement = event.target;
        maskElements.forEach((item) => {
            const { type, value } = item;
            if (
                (type === 'id' && topElement.id === value) ||
                (type === 'class' && topElement.classList.contains(value))
            ) {
                topElement = topElement.parentElement;
            }
        });
    });
    if (horde) {
        horde.stop();
    }
    horde = gremlins.createHorde({
        species: [
            gremlins.species.toucher({
                showAction: (x, y) => {},
            }),
        ],
        mogwais: [gremlins.mogwais.alert(), gremlins.mogwais.gizmo()],
        strategies: [
            gremlins.strategies.allTogether({
                nb: Number.MAX_VALUE,
                delay: 100,
            }),
        ],
    });
    horde.unleash();

    if (tabInterval) {
        clearInterval(tabInterval);
    }

    // run monkey
    tabInterval = setInterval(() => {
        const triggerList = [];
        const extention = elementExt.map((item) => item.key);
        const allElements = document.querySelectorAll([...elements, ...extention].join(',')) || [];
        allElements.forEach((element) => {
                if (
                    isVisable(element) &&
                    topElement &&
                    topElement.contains(element)
                ) {
                    triggerList.push(element);
                }
            });
        if (triggerList.length > 0) {
            const index = chance.integer({
                min: 0,
                max: triggerList.length - 1,
            });
            const element = jQuery(triggerList[index]);
            element.focus();

            if (elementEvent && elementEvent.length) {
                const eventIndex = chance.integer({
                    min: 0,
                    max: elementEvent.length - 1,
                });
                const targetEvent = elementEvent[eventIndex];
                let action;
                elementEventList.forEach((item) => {
                    if (item.key === targetEvent) {
                        action = item.action;
                    }
                });
                action && action(element);
            }
        }
    }, 500);
}

function isVisable(element) {
    return element && element.offsetParent;
}

function runMonkey() {
    chrome.storage.local.get(null, function (items) {
        runByConfig(items);
    });
}

function stopMonkey() {
    stopTimer();
    stopAnalysis();
    clearTimeout(stopTimeout);
    clearInterval(tabInterval);
    if (horde) {
        horde.stop();
        horde = null;
    }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.cmd == CMD_RUN_MONKEY) {
        runMonkey();
    }
    sendResponse('runMonkey');
});
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.cmd == CMD_STOP_MONKEY) {
        stopMonkey();
    }
});
