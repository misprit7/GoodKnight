import React, { useState } from 'react';
import { render } from 'react-dom';
import { GlobalStyle } from './styles/GlobalStyle';

import './App.css';
import './components/Chessground-React/assets/chessground.css';
import './components/Chessground-React/assets/theme.css';

import Viewer from './components/Viewer';
import MoveList from './components/MoveList';
import { Col, Layout, Menu, Row } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import {
  LaptopOutlined,
  NotificationOutlined,
  RadarChartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Sider from 'antd/lib/layout/Sider';
import SubMenu from 'antd/lib/menu/SubMenu';

var kokopu = require('kokopu');

import { variationsEqual } from './utils/KokopuHelper';

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'root');
document.body.appendChild(mainElement);

const App = () => {
  const [db, setDb] = useState(
    kokopu.pgnRead(`[Event "Vienna Gambit: Accepted"]
[Site "https://lichess.org/study/zYDwcmyb/9gO091PM"]
[Result "*"]
[Annotator "https://lichess.org/@/misprit7"]
[UTCDate "2021.07.12"]
[UTCTime "23:13:49"]
[Variant "Standard"]
[ECO "C26"]
[Opening "Vienna Game: Vienna Gambit"]

1. e4 e5 2. Nc3 Nf6 3. f4 (3. Nf3 Nc6 4. Bb5 (4. d4 exd4 5. Nxd4 (5. e5 d3 6. e6 d2+ 7. Kxd2 Ne4+ 8. Kd3 Nc5+ 9. Ke2 Na4 10. Nb5 Nc3+ 11. Kd3 Ne4 12. Ke3 Nc5 13. Kd2 Ne4+ 14. Kd3)) 4... h5 5. h3) 3... exf4 (3... d5 4. fxe5) 4. e5 Ng8 (4... Qe7 { This isn't great for black since you can just unpin yourself. } 5. Qe2 Ng8 6. Nf3) 5. Nf3 d6 (5... d5 6. d4 Bb4 7. Bxf4)  (5... Nc6 6. d4 d5 7. Bxf4) 6. d4 dxe5 7. Qe2 { Bb5 is slightly better from the computer, but leads to some insanely sharp lines that rely on some hard to find tactics which isn't really worth risking an already better position in. } 7... Be7 { Nxe5 is bad since it allows Bh4+ which can't easily be stopped. } 8. Qxe5 *`)
  );
  const [curVariation, setCurVariation] = useState(db.game(0).mainVariation());
  const [curGame, setCurGame] = useState(0)
  const [curNode, setCurNode] = useState(-1);

  const variationHasChildren = curNode >= 0 && curVariation.nodes()[curNode].variations().length > 0
  // Whether next and backwards buttons are enabled for the user
  const nextEnable = variationHasChildren || curNode < curVariation.nodes().length - 1;
  const prevEnable = curNode > -1;


  // Called every time next button is pressed, if possible move to next move in variation, if not go to next move in first child variation
  const nextMove = () => {
    if (nextEnable) {
      if(!variationHasChildren){
        setCurNode(curNode + 1);
      } else {
        setCurVariation(curVariation.nodes()[curNode].variations()[0])
        setCurNode(0)
      }
    }
  };

  // Called every time previous button is pressed, if possible move to previous move in variation, otherwise move to last move in parent variation
  const prevMove = () => {
    if (prevEnable) {
      if (curNode > 0){
        setCurNode(curNode - 1);
      } else {
        let newNode = curVariation.parentNode()
        let newVariation = newNode.parentVariation()
        setCurVariation(newVariation)
        // Move offset only counts after every black move, so have to make an adjustment for which side ot move it is
        let moveOffset = newNode.fullMoveNumber() - newVariation.initialFullMoveNumber()
        let sameColor = newNode.moveColor() == newVariation.first().moveColor()
        setCurNode(moveOffset * 2 - (sameColor ? 0 : 1) - 1)
        
      }
    }
  };

  // Triggers every time the move list is clicked, it goes to the appropriate variation
  const moveListClick = (variation: any, node: number) => {
    setCurVariation(variation);
    setCurNode(node);
  };

  return (
    <>
      <GlobalStyle />
      <Layout style={{ height: '100vh' }}>
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
              <SubMenu
                key="sub3"
                icon={<NotificationOutlined />}
                title="subnav 3"
              >
                <Menu.Item key="9">option9</Menu.Item>
                <Menu.Item key="10">option10</Menu.Item>
                <Menu.Item key="11">option11</Menu.Item>
                <Menu.Item key="12">option12</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Content>
            <Row>
              <Col span={2} />
              <Col span={12} style={{ top: '10%' }}>
                <Viewer
                  position={
                    curNode == -1
                      ? new kokopu.Position('regular')
                      : curVariation.nodes()[curNode].position()
                  }
                  nextMove={nextMove}
                  prevMove={prevMove}
                  nextEnable={nextEnable}
                  prevEnable={prevEnable}
                />
              </Col>
              <Col span={1} />
              <Col span={7} style={{ top: '10%' }}>
                <MoveList
                  game={db.game(curGame)}
                  clickCallback={moveListClick}
                  curNode={curNode}
                  curVariation={curVariation}
                />
              </Col>
              <Col span={2} />
            </Row>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

render(<App />, mainElement);
