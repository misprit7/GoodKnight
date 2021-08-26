import { FieldTimeOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Drawer, Form, Input, Row, Select, Upload } from 'antd';
const { Option } = Select;
import Title from 'antd/lib/typography/Title';
import { UploadChangeParam } from 'antd/lib/upload';
// import { Engine } from 'node-uci';
import React, { useState } from 'react';

// import { dialog, UploadFile } from 'electron';
const electron = window.require('electron')
const remote = electron.remote
const {dialog} = remote
const {ipcRenderer } = require('electron')


const EngineEval = () => {
  // const [engine, setEngine] = useState<Engine | null>(null);
  const [newEngineVisible, setNewEngineVisible] = useState(false);
  const [engineId, setEngineId] = useState({name: undefined, author: undefined})
  const [engineFilePath, setEngineFilePath] = useState('')
  const [engineOptions, setEngineOptions] = useState()

  const onEngineSelect = (option: string) => {
    if (option == 'new') {
      setNewEngineVisible(true);
      // setEngine(null)
    }
  };

  const closeNewEngine = () => {
    setNewEngineVisible(false);
  };

  // console.log('init')
  // const e = new Engine('C:\\tools\\Chess Engines\\komodo-12.1.1-64bit-bmi2.exe')
  // e.init().then(eng => {console.log("outer engine initialized")})
  // new Promise(resolve => setTimeout(resolve, 500)).then(()=>{console.log(e.id)})


  ipcRenderer.on('engine-init', (event, id, filePath, options) => {
    setEngineId(id)
    setEngineFilePath(filePath)
    setEngineOptions(options)
    console.log('id received')
    console.log(id)
  })

  const newEngineUpload = () => {
    console.log('clicked')
    // dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] }).then(result => {
    //   // let eng = new Engine(result.filePaths[0])
    //   let eng = new Engine('C:\\tools\\Chess Engines\\komodo-12.1.1-64bit-bmi2.exe')
    //   console.log('dialog returned')
    //   // console.log(eng)
    //   // eng.chain().init().exec()
    //   return eng.init()
    //   // await new Promise(resolve => setTimeout(resolve, 3000))
    //   // console.log('engine initialized')
    //   // setEngine(eng)
    // }).then(eng => {
    //   console.log(eng)
    // })
    // new Engine('C:\\tools\\Chess Engines\\komodo-12.1.1-64bit-bmi2.exe').init().then(eng => {console.log("inner engine initialized")})
    // new Promise(resolve => setTimeout(resolve, 3000)).then(()=>{console.log("timier finished")})

    ipcRenderer.send('engine-init')
  }

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
              <Form.Item
                name="upload"
                label="Engine Executable Upload"
              >
                <Button icon={<UploadOutlined/>} onClick={newEngineUpload}>
                  Click to Upload
                </Button>
              </Form.Item>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <p>
                  Engine Name: 
                </p>
                <Input disabled value={engineId.name}/>
              </Col>
              <Col span={12}>
                <p>
                  Engine Author(s): 
                </p>
                <Input disabled value={engineId.author}/>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <p>Engine Path: </p>
                <Input disabled value={engineFilePath}/>
              </Col>
            </Row>
            <Row gutter={16}>
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
                  rules={[{ required: true, message: 'Please choose the approver' }]}
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
                  rules={[{ required: true, message: 'Please choose the dateTime' }]}
                >
                  <DatePicker.RangePicker
                    style={{ width: '100%' }}
                  />
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
                  <Input.TextArea rows={4} placeholder="please enter url description" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
      </Drawer>
    </>
  );
};

export default EngineEval;
