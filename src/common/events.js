const keydownEvent = {
    key: 'keydown',
    label: '按键',
    action: gremlins.species.typer(),
};
const touchEvent = {
    key: 'touch',
    label: '触摸',
    action: gremlins.species.toucher(),
};
const clickEvent = {
    key: 'click',
    label: '点击',
    action: gremlins.species.clicker(),
};
const formEvent = {
    key: 'form',
    label: '表单',
    action: gremlins.species.formFiller(),
};
const scrollEvent = {
    key: 'scroll',
    label: '滚动',
    action: gremlins.species.scroller(),
};
const eventList = [keydownEvent, touchEvent, clickEvent, formEvent, scrollEvent];

export {
    eventList,
    keydownEvent,
    touchEvent,
    clickEvent,
    formEvent,
    scrollEvent,
};
