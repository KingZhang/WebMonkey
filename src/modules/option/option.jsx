import React, { useState, useEffect, useRef, createRef } from 'react';
import {
    Form,
    Button,
    Radio,
    Select,
    InputNumber,
    Modal,
    Space,
    Input,
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { eventList } from 'appRoot/common/mouseEvents';
import { elementList, elementEventList } from 'appRoot/common/elementEvents';

const { Option } = Select;

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
};
const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
    },
};

const clearStorage = (callback) => {
    chrome.storage.local.clear(callback);
};

const OptionPage = () => {
    const formRef = useRef(null);
    const [mode, setMode] = useState('elementMode');

    const onFinish = (values) => {
        console.log('values', values);
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
    const elementEventOptions = elementEventList.map((item) => (
        <Option key={item.key}>{item.label}</Option>
    ));

    const elementOptions = elementList.map((item) => (
        <Option key={item.key}>{item.label}</Option>
    ));

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
                        <Radio.Button value="elementMode">
                            元素模式
                        </Radio.Button>
                        <Radio.Button value="mouseMode">鼠标模式</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                {mode === 'mouseMode' && (
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

                {mode === 'elementMode' && (
                    <>
                        <Form.Item
                            label="测试事件"
                            name="elementEvent"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择模拟测试事件!',
                                },
                            ]}
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                style={{ width: '100%' }}
                                placeholder="选择测试事件"
                            >
                                {elementEventOptions}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="测试元素"
                            name="elements"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择模拟测试元素!',
                                },
                            ]}
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                style={{ width: '100%' }}
                                placeholder="选择测试元素"
                            >
                                {elementOptions}
                            </Select>
                        </Form.Item>
                        <Form.List name="elementExt">
                            {(fields, { add, remove }) => (
                                <>
                                    <Form.Item label="自定义元素">
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            block
                                            icon={<PlusOutlined />}
                                        >
                                            添加自定义测试元素
                                        </Button>
                                    </Form.Item>
                                    {fields.map(
                                        ({ key, name, ...restField }) => (
                                            <Space
                                                key={key}
                                                style={{
                                                    display: 'flex',
                                                    marginBottom: 8,
                                                    marginLeft: '16.5%',
                                                }}
                                                align="baseline"
                                            >
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'key']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                '请输入key',
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        placeholder="key"
                                                        style={{
                                                            width: '200px',
                                                        }}
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'label']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                '请输入label',
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        placeholder="label"
                                                        style={{
                                                            width: '200px',
                                                        }}
                                                    />
                                                </Form.Item>
                                                <MinusCircleOutlined
                                                    onClick={() => remove(name)}
                                                />
                                            </Space>
                                        ),
                                    )}
                                </>
                            )}
                        </Form.List>
                    </>
                )}

                <Form.List name="hiddenElements">
                    {(fields, { add, remove }, { errors }) => (
                        <>
                            <Form.Item label="隐藏元素：">
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    添加隐藏元素
                                </Button>
                            </Form.Item>
                            {fields.map((key, name, ...restField) => (
                                <Space
                                    key={key}
                                    style={{
                                        display: 'flex',
                                        marginBottom: 8,
                                        marginLeft: '16.5%',
                                    }}
                                    align="baseline"
                                >
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'type']}
                                    >
                                        <Radio.Group
                                            defaultValue="id"
                                            style={{
                                                display: 'flex',
                                            }}
                                        >
                                            <Radio.Button value="id">
                                                id
                                            </Radio.Button>
                                            <Radio.Button value="class">
                                                class
                                            </Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'value']}
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入value',
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="value"
                                            style={{
                                                width: '200px',
                                            }}
                                        />
                                    </Form.Item>
                                    <MinusCircleOutlined
                                        onClick={() => remove(name)}
                                    />
                                </Space>
                            ))}
                        </>
                    )}
                </Form.List>

                <Form.List name="maskElements">
                    {(fields, { add, remove }, { errors }) => (
                        <>
                            <Form.Item label="遮罩元素：">
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    添加遮罩元素
                                </Button>
                            </Form.Item>
                            {fields.map((key, name, ...restField) => (
                                <Space
                                    key={key}
                                    style={{
                                        display: 'flex',
                                        marginBottom: 8,
                                        marginLeft: '16.5%',
                                    }}
                                    align="baseline"
                                >
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'type']}
                                    >
                                        <Radio.Group
                                            defaultValue="id"
                                            style={{
                                                display: 'flex',
                                            }}
                                        >
                                            <Radio.Button value="id">
                                                id
                                            </Radio.Button>
                                            <Radio.Button value="class">
                                                class
                                            </Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'value']}
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入value',
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="value"
                                            style={{
                                                width: '200px',
                                            }}
                                        />
                                    </Form.Item>
                                    <MinusCircleOutlined
                                        onClick={() => remove(name)}
                                    />
                                </Space>
                            ))}
                        </>
                    )}
                </Form.List>

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
