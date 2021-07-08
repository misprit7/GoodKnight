import React, { useState } from 'react'
import { render } from 'react-dom'
import { GlobalStyle } from './styles/GlobalStyle'

import './App.css';
import './components/Chessground-React/assets/chessground.css'
import './components/Chessground-React/assets/theme.css'

import Viewer from './components/Viewer'
import { Col, Layout, Menu, Row } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import { LaptopOutlined, NotificationOutlined, RadarChartOutlined, UserOutlined } from '@ant-design/icons';
import Sider from 'antd/lib/layout/Sider';
import SubMenu from 'antd/lib/menu/SubMenu';

var kokopu = require('kokopu');

const mainElement = document.createElement('div')
mainElement.setAttribute('id', 'root')
document.body.appendChild(mainElement)

const App = () => {

  const [db, setDb] = useState(kokopu.pgnRead(`[Event "Vienna Gambit: Accepted"]
    [Site "https://lichess.org/study/zYDwcmyb/9gO091PM"]
    [Result "*"]
    [UTCDate "2021.06.19"]
    [UTCTime "06:41:00"]
    [Variant "Standard"]
    [ECO "C26"]
    [Opening "Vienna Game: Vienna Gambit"]
    [Annotator "https://lichess.org/@/misprit7"]

    1. e4 e5 2. Nc3 Nf6 3. f4 exf4 4. e5 Ng8 (4... Qe7 { This isn't great for black since you can just unpin yourself. } 5. Qe2 Ng8 6. Nf3) 5. Nf3 d6 (5... d5 6. d4 Bb4 7. Bxf4)  (5... Nc6 6. d4 d5 7. Bxf4) 6. d4 dxe5 7. Qe2 { Bb5 is slightly better from the computer, but leads to some insanely sharp lines that rely on some hard to find tactics which isn't really worth risking an already better position in. } 7... Be7 { Nxe5 is bad since it allows Bh4+ which can't easily be stopped. } 8. Qxe5 *`)
  )
  const [curVariation, setVariation] = useState(db.game(0).mainVariation())
  const [curNode, setCurNode] = useState(0)

  const nextEnable = curNode < curVariation.nodes().length-1
  const prevEnable = curNode > 0

  // console.log(curVariation)

  const nextMove = () => {
    if (nextEnable){
      setCurNode(curNode + 1)
    }
  }

  const prevMove = () => {
    if (prevEnable){
      setCurNode(curNode - 1)
    }
  }

  return (
    <>
      <GlobalStyle />
      <Layout style={{height: "100vh"}}>
        <Header>
          <div className="logo" />
        </Header>
        <Layout>
          <Sider>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
                <Menu.Item key="1">option1</Menu.Item>
                <Menu.Item key="2">option2</Menu.Item>
                <Menu.Item key="3">option3</Menu.Item>
                <Menu.Item key="4">option4</Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" icon={<LaptopOutlined />} title="subnav 2">
                <Menu.Item key="5">option5</Menu.Item>
                <Menu.Item key="6">option6</Menu.Item>
                <Menu.Item key="7">option7</Menu.Item>
                <Menu.Item key="8">option8</Menu.Item>
              </SubMenu>
              <SubMenu key="sub3" icon={<NotificationOutlined />} title="subnav 3">
                <Menu.Item key="9">option9</Menu.Item>
                <Menu.Item key="10">option10</Menu.Item>
                <Menu.Item key="11">option11</Menu.Item>
                <Menu.Item key="12">option12</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Content>
            <Row>
              <Col span={6} />
              <Col span={12} style={{ top: '10%' }}>
                <Viewer position={curVariation.nodes()[curNode].position()} nextMove={nextMove} prevMove={prevMove} nextEnable={nextEnable} prevEnable={prevEnable}/>
              </Col>
              <Col span={6} />
            </Row>
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

render(<App />, mainElement)
