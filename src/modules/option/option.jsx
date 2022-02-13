import React, { useState, useEffect, useRef, createRef } from 'react';
import { Form, Button, Radio, Select, InputNumber, Modal } from 'antd';
import { eventList } from 'appRoot/common/events';

const { Option } = Select;

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const clearStorage = (callback) => {
    chrome.storage.local.clear(callback);
};

const OptionPage = () => {
    const formRef = useRef(null);
    const [mode, setMode] = useState('mouse');
    const onFinish = (values) => {
        clearStorage(() => {
            chrome.storage.local.set(values, function () {
                Modal.success({
                    content: '保存成功',
                });
            });
        });
    };
    const mouseOptions = eventList.map((item) => (
        <Option key={item.key}>{item.label}</Option>
    ));
    const tabindexOptions = [
        <Option key='click'>点击</Option>,
        <Option key='input'>输入</Option>,
    ];

    useEffect(() => {
        chrome.storage.local.get(null, function (items) {
            formRef.current.setFieldsValue(items);
            if (items.mode) {
                setMode(items.mode);
            }
        });
    }, []);

    const resetForm = () => {
        formRef.current.resetFields();
        clearStorage();
    };

    const onModeChange = (value) => {
        setMode(value.target.value);
    };

    return (
        <div style={{ paddingTop: '2rem' }}>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                onFinish={onFinish}
                ref={formRef}
            >
                <Form.Item label="测试模式" name="mode">
                    <Radio.Group onChange={onModeChange} defaultValue={mode}>
                        <Radio.Button value="mouse">鼠标模式</Radio.Button>
                        <Radio.Button value="tabIndex">TabIndex</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                {mode === 'mouse' && (
                    <Form.Item
                        label="测试事件"
                        name="event"
                        rules={[
                            { required: true, message: '请选择模拟测试事件!' },
                        ]}
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="选择测试事件"
                        >
                            {mouseOptions}
                        </Select>
                    </Form.Item>
                )}
                {mode === 'tabIndex' && (
                    <Form.Item
                        label="测试事件"
                        name="tabEvent"
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="选择测试事件"
                        >
                            {tabindexOptions}
                        </Select>
                    </Form.Item>
                )}
                <Form.Item
                    label="测试时长"
                    rules={[{ required: true, message: '请选择测试时长!' }]}
                >
                    <Form.Item
                        name="durationHour"
                        style={{
                            display: 'inline-block',
                            margin: '0 8px',
                        }}
                    >
                        <InputNumber min={0} max={24} />
                    </Form.Item>
                    <span className="ant-form-text"> 小时</span>
                    <Form.Item
                        name="durationMinute"
                        style={{
                            display: 'inline-block',
                            margin: '0 8px',
                        }}
                    >
                        <InputNumber min={0} max={60} />
                    </Form.Item>
                    <span className="ant-form-text"> 分钟</span>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button onClick={resetForm} style={{ marginRight: '2rem' }}>
                        重置
                    </Button>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default OptionPage;
