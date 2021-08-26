import { FieldTimeOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Switch,
  Upload,
} from 'antd';
const { Option } = Select;
import Title from 'antd/lib/typography/Title';
import { UploadChangeParam } from 'antd/lib/upload';
import { EngineOptions } from 'node-uci';
// import { Engine } from 'node-uci';
import React, { useState } from 'react';

// import { dialog, UploadFile } from 'electron';
const electron = window.require('electron');
const remote = electron.remote;
const { dialog } = remote;
const { ipcRenderer } = require('electron');

const EngineEval = () => {
  const [newEngineVisible, setNewEngineVisible] = useState(false);
  const [engineId, setEngineId] = useState({
    name: undefined,
    author: undefined,
  });
  const [engineFilePath, setEngineFilePath] = useState('');
  const [engineOptions, setEngineOptions] = useState<EngineOptions>(new Map());

  // Engine selection dropdown
  const onEngineSelect = (option: string) => {
    if (option == 'new') {
      setNewEngineVisible(true);
    }
  };

  const closeNewEngine = () => {
    setNewEngineVisible(false);
  };

  // Engine initialization event
  ipcRenderer.on('engine-init', (event, id, filePath, options) => {
    setEngineId(id);
    setEngineFilePath(filePath);
    setEngineOptions(options);
    console.log('id received');
    console.log(id);
  });

  // New engine upload triggers ipc communication to init engine
  const newEngineUpload = () => {
    console.log('pushed');
    ipcRenderer.send('engine-init');
  };

  const optionsEntries: JSX.Element[] = [];

  engineOptions.forEach((value, key, map) => {
    const formEntry: JSX.Element = (() => {
      switch (value.type) {
        case 'check':
          return <Switch defaultChecked={value.default as boolean} />;
        case 'spin':
          return (
            <InputNumber
              min={value.min}
              max={value.max}
              defaultValue={value.default as number}
            />
          );
        case 'combo':
          return (
            <Select defaultValue={(value.options as string[])[0]}>
              {value.options?.map((comboOption) => {
                return <Option value={comboOption}>{comboOption}</Option>;
              })}
            </Select>
          );
        case 'string':
          return <Input defaultValue={value.default as string} />;
        case 'button':
          return <></>;
        default:
          return <></>;
      }
    })();
    optionsEntries.push(
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name={key} label={key}>
            {formEntry}
          </Form.Item>
        </Col>
      </Row>
    );
  });

  return (
    <>
      <Card
        title={engineId == null ? 'No Engine Selected' : 'placeholder'}
        extra={
          <Select
            defaultValue="none"
            onSelect={onEngineSelect}
            style={{ width: '120px', float: 'right' }}
          >
            <Option value="none">None</Option>
            <Option value="new">New</Option>
          </Select>
        }
        style={{ height: '20vh', borderStyle: 'solid', padding: '10px' }}
      >
        {engineId == null ? <></> : <></>}
      </Card>
      <Drawer
        closable={true}
        placement="right"
        visible={newEngineVisible}
        onClose={closeNewEngine}
        title="New Engine Selection"
        width={720}
      >
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Form.Item name="upload" label="Engine Executable Upload">
              <Button icon={<UploadOutlined />} onClick={newEngineUpload}>
                Click to Upload
              </Button>
            </Form.Item>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <p>Engine Name:</p>
              <Input disabled value={engineId.name} />
            </Col>
            <Col span={12}>
              <p>Engine Author(s):</p>
              <Input disabled value={engineId.author} />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <p>Engine Path: </p>
              <Input disabled value={engineFilePath} />
            </Col>
          </Row>
          {optionsEntries}
          {/* <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Type"
                rules={[{ required: true, message: 'Please choose the type' }]}
              >
                <Select placeholder="Please choose the type">
                  <Option value="private">Private</Option>
                  <Option value="public">Public</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="approver"
                label="Approver"
                rules={[
                  { required: true, message: 'Please choose the approver' },
                ]}
              >
                <Select placeholder="Please choose the approver">
                  <Option value="jack">Jack Ma</Option>
                  <Option value="tom">Tom Liu</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dateTime"
                label="DateTime"
                rules={[
                  { required: true, message: 'Please choose the dateTime' },
                ]}
              >
                <DatePicker.RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: 'please enter url description',
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="please enter url description"
                />
              </Form.Item>
            </Col>
          </Row> */}
        </Form>
      </Drawer>
    </>
  );
};

export default EngineEval;
