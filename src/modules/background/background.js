import { sendChromeMessage } from 'appRoot/common/utils';
import { CMD_RUN_MONKEY, CMD_STOP_MONKEY } from 'appRoot/common/constants';

chrome.contextMenus.create({
    title: '启动Monkey测试',
    contexts: ['all'],
    onclick: function () {
        sendChromeMessage(
            { cmd: CMD_RUN_MONKEY, value: CMD_RUN_MONKEY },
            function (response) {},
        );
    },
});
chrome.contextMenus.create({
    title: '停止Monkey测试',
    contexts: ['all'],
    onclick: function () {
        sendChromeMessage(
            { cmd: CMD_STOP_MONKEY, value: CMD_STOP_MONKEY },
            function (response) {},
        );
    },
});
