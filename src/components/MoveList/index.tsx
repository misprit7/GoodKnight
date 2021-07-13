import { NodeCollapseOutlined } from '@ant-design/icons';
import { Button, Col, Divider, List, Row } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import React from 'react';

import { variationsEqual } from '../../utils/KokopuHelper';

var kokopu = require('kokopu');

type MoveListProps = {
  game: any;
  curVariation: any;
  curNode: any;
  clickCallback: (variation: any, node: number) => void;
};

type VariationProps = {
  variation: any;
  curVariation: any;
  curNode: any;
  clickCallback: (variation: any, node: number) => void;
  nestLevel: number
};

const Variation = (props: VariationProps) => {
  const rowList: JSX.Element[] = [];
  const nodes = props.variation.nodes();

  var node = 0;
  var i = 0;
  do {
    const moveList: JSX.Element[] = [];
    do {
      const isPrimary =
        node == props.curNode &&
        variationsEqual(props.curVariation, props.variation);
      // Pretty hacky, but have to do it this way otherwise weird
      // things happen in callback
      let temp = node;
      moveList.push(
        <Button
          key={node}
          type={isPrimary ? 'primary' : 'text'}
          onClick={() => {
            props.clickCallback(props.variation, temp);
          }}
          style={{padding: '2px'}}
        >
          {nodes[node].notation()}
        </Button>
      );
      ++node;
    } while (node < nodes.length && !nodes[node - 1].variations().length);
    rowList.push(<Row key={i} style={{marginLeft: props.nestLevel*10+'px'}}>{moveList}</Row>);
    ++i;
    if (node - 1 < nodes.length && nodes[node - 1].variations().length) {
      for (const variation of nodes[node - 1].variations()) {
        rowList.push(<Divider key={i} style={{marginTop: '6px', marginBottom: '6px'}}/>)
        ++i
        rowList.push(
          <Row key={i}>
            <Variation
              variation={variation}
              curVariation={props.curVariation}
              curNode={props.curNode}
              clickCallback={props.clickCallback}
              nestLevel={props.nestLevel + 1}
            />
          </Row>
        );
        ++i
      }
      rowList.push(<Divider key={i} style={{marginTop: '6px', marginBottom: '6px'}}/>)
      ++i
    }
  } while (node < nodes.length);
  return <>{rowList}</>;
};

const MoveList = (props: MoveListProps) => {
  const nodes = props.game.mainVariation().nodes();
  const moveList: JSX.Element[] = [];

  var curNode = 0;

  const moveButton = (show: boolean, nodeNum: number) => {
    if (show) {
      curNode++;
      const isPrimary =
        nodeNum == props.curNode &&
        variationsEqual(props.curVariation, props.game.mainVariation());
      return (
        <Button
          block
          type={isPrimary ? 'primary' : 'text'}
          onClick={() => {
            props.clickCallback(props.game.mainVariation(), nodeNum);
          }}
        >
          {nodes[nodeNum].notation()}
        </Button>
      );
    } else {
      return <p style={{ textAlign: 'center' }}>...</p>;
    }
  };

  for (let i = 0; curNode < nodes.length; ++i) {
    const whiteToMove = nodes[curNode].position().turn() != 'w';
    const variations = nodes[curNode].variations();
    const whiteVariation = variations.length > 0;
    const variationElements: JSX.Element[] = [];
    if (variations.length) {
      for (const [j, v] of variations.entries()) {
        variationElements.push(
          <Variation
            key={j}
            variation={v}
            curVariation={props.curVariation}
            curNode={props.curNode}
            clickCallback={props.clickCallback}
            nestLevel={1}
          />
        );
      }
    }
    moveList.push(
      <List.Item key={i}>
        <Row style={{ width: '100%' }}>
          <Col span={12}>{moveButton(whiteToMove, curNode)}</Col>
          <Col span={12}>
            {moveButton(
              (!whiteVariation || !whiteToMove) && curNode < nodes.length,
              curNode
            )}
          </Col>
        </Row>
        {variationElements}
      </List.Item>
    );
  }

  return (
    <>
      <List
        itemLayout="vertical"
        dataSource={moveList}
        renderItem={(item) => {
          return item;
        }}
        style={{height: '80vh', overflowY: 'scroll', borderStyle: 'solid'}}
      />
    </>
  );
};

export default MoveList;
