// ********************************************************** //
// Includes
// ********************************************************** //
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
import React, { useState, useEffect } from 'react';

// import { dialog, UploadFile } from 'electron';
const electron = window.require('electron');
const remote = electron.remote;
const { dialog } = remote;
const { ipcRenderer } = require('electron');


// ********************************************************** //
// Component
// ********************************************************** //
const EngineEval = (props: {index: number, fen: string}) => {
  const [newEngineVisible, setNewEngineVisible] = useState(false);
  const [engineId, setEngineId] = useState({
    name: undefined,
    author: undefined,
  });
  const [engineFilePath, setEngineFilePath] = useState('');
  const [engineOptions, setEngineOptions] = useState<EngineOptions>(new Map());

  ipcRenderer.send('engine-new-pos', props.index, props.fen)
  console.log('init engine')

  // Engine selection dropdown
  const onEngineSelect = (option: string) => {
    if (option == 'new') {
      setNewEngineVisible(true);
    }
  };

  const closeNewEngine = () => {
    setNewEngineVisible(false);
  };

  // All IPC stuff has to go here
  useEffect( () => {
    // Engine initialization event
    ipcRenderer.on('engine-init', (event, index, id, filePath, options) => {
      if(index == props.index){
        setEngineId(id);
        setEngineFilePath(filePath);
        setEngineOptions(options);
        console.log('id received');
        console.log(id, event);
      }
    });
  }, [])

  // New engine upload triggers ipc communication to init engine
  const newEngineUpload = () => {
    console.log('pushed');
    ipcRenderer.send('engine-init', props.index);
  };

  const optionsEntries: JSX.Element[] = [];

  engineOptions.forEach((value, key, map) => {
    const formEntry: JSX.Element = (() => {
      switch (value.type) {
        case 'check':
          return <Switch checked={value.default as boolean} />;
        case 'spin':
          return (
            <InputNumber
              min={value.min}
              max={value.max}
              value={value.default as number}
            />
          );
        case 'combo':
          return (
            <Select value={(value.options as string[])[0]}>
              {value.options?.map((comboOption) => {
                return <Option value={comboOption}>{comboOption}</Option>;
              })}
            </Select>
          );
        case 'string':
          return <Input value={value.default as string} />;
        case 'button':
          return <></>;
        default:
          return <></>;
      }
    })();
    if(value.type == 'button' || key.startsWith('UCI_')){
      return;
    }
    optionsEntries.push(
      <Form.Item name={key} label={key}>
        {formEntry}
      </Form.Item>
    );
  });

  const optionsRows: JSX.Element[] = []
  const optionsPerRow = 3
  for(let i = 0; i < optionsEntries.length; i += optionsPerRow){
    optionsRows.push(
      <Row key={(i / optionsPerRow).toString()} gutter={16}>
          {optionsEntries.slice(i, i + optionsPerRow).map((element, j) => {
            return (
              <Col span={24 / optionsPerRow} key={i+j}>
                {element}
              </Col>
            )
          })}
      </Row>
    )
  }

  return (
    <>
      <Card
        title={engineId == null ? 'No Engine Selected' : engineId.name}
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
          {optionsRows}
        </Form>
      </Drawer>
    </>
  );
};

export default EngineEval;
