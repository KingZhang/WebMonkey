import { addPageScript } from 'appRoot/common/utils';
import { CMD_RUN_MONKEY, CMD_STOP_MONKEY } from 'appRoot/common/constants';
import { eventList } from 'appRoot/common/events';
import Chance from 'chance';
import jQuery from 'jquery';

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

    if (config.mode === 'tabIndex') {
        runTabIndexMode(config);
    } else {
        runMouseMode(config);
    }

    const { durationHour = 0, durationMinute = 0 } = config;
    // 停止monkey
    if (durationHour || durationMinute) {
        setTimeout(
            stopMonkey,
            durationHour * 60 * 60 * 1000 + durationMinute * 60 * 1000,
        );
    }
}

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

function runTabIndexMode(config) {
    const { tabEvent } = config;
    // get top element
    let topElement = null;
    document.addEventListener('touchstart', (event) => {
        event.preventDefault();
        event.stopPropagation();
        topElement = event.target;
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
        mogwais: [
            gremlins.mogwais.alert(),
            gremlins.mogwais.gizmo(),
        ],
        strategies: [gremlins.strategies.allTogether({ nb: Number.MAX_VALUE, delay: 100 })],
    });
    horde.unleash();

    if (tabInterval) {
        clearInterval(tabInterval);
    }

    // run monkey
    tabInterval = setInterval(() => {
        const elements = [];
        document.querySelectorAll('[tabindex]').forEach((element) => {
            if (isVisable(element) && topElement && topElement.contains(element)) {
                elements.push(element);
            }
        });
        if (elements.length > 0) {
            const index = chance.integer({ min: 0, max: elements.length - 1 });
            const element = jQuery(elements[index]);
            element.focus();

            if (tabEvent && tabEvent.length) {
                const eventIndex = chance.integer({ min: 0, max: tabEvent.length - 1 });
                const triggerEvent = tabEvent[eventIndex];
                switch (triggerEvent) {
                    case 'click':
                        element.click();
                        break;
                    case 'input':
                        if (typeof element.val === 'function') {
                            element.val(chance.bool() ? chance.string() : '');
                        }
                        break;
                    default:
                        break;
                }
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
