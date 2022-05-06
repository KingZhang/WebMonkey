import Chance from 'chance';
import jQuery from 'jquery';

const chance = new Chance();

const clickEvent = {
    key: 'click',
    label: '点击',
    action: (element) => {
        jQuery(element).click();
    }
};

const dbclickEvent = {
    key: 'dbclick',
    label: '双击',
    action: (element) => {
        jQuery(element).dbclick && jQuery(element).dbclick();
    }
};

const inputEvent = {
    key: 'input',
    label: '输入',
    action: (element) => {
        const _element = jQuery(element);
        if (element[0].nodeName === 'SELECT') {
            // 处理下拉框选中事件
            const options = _element.find('option');
            const index = chance.integer({
                min: 0,
                max: options.length - 1,
            });
            _element.val(options[index].value);
        } else {
            if (typeof _element.val === 'function') {
                _element.val(chance.bool() ? chance.string() : '');
            }
        }
    }
};

const elementEventList = [clickEvent, dbclickEvent, inputEvent];
const elementList = [{
    key: '[tabindex]',
    label: 'tabindex元素',
}, {
    key: 'input',
    label: '输入框',
}, {
    key: 'textarea',
    label: '文本框',
}, {
    key: 'a',
    label: '超链接',
}, {
    key: 'select',
    label: '选择框',
}];

export {
    elementList,
    elementEventList,
    clickEvent,
    dbclickEvent,
    inputEvent,
};