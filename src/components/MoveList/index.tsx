import { NodeCollapseOutlined } from "@ant-design/icons";
import { Button, Col, List, Row } from "antd";
import React from "react";


var kokopu = require('kokopu');


type MoveListProps = {
	game: any
  curVariation: any
  curNode: any
  clickCallback: (variation: any, node: number) => void
}

function compareVariations(var1: any, var2: any){
  const node1 = var1.first()
  const node2 = var2.first()
  return node1.fullMoveNumber == node2.fullMoveNumber && node1.position().fen() == node2.position().fen() 
}

const MoveList = (props: MoveListProps) => {

  const nodes = props.game.mainVariation().nodes()
	const moveList: JSX.Element[] = []


  var curNode = 0

  const moveButton = (show: boolean, nodeNum: number) => {
    if (show) {
      curNode++
      const isPrimary = nodeNum == props.curNode && compareVariations(props.curVariation, props.game.mainVariation())
      return (<Button block type={isPrimary ? "primary" : "text"} onClick={()=>{props.clickCallback(props.game.mainVariation(), nodeNum)}}>
        {nodes[nodeNum].notation()}
      </Button>)
    } else {
      return (<p style={{textAlign: 'center'}}>...</p>)
    }
  }

	for(let i = 0; curNode < nodes.length; ++i){
    const whiteToMove = nodes[curNode].position().turn() != 'w'
    const whiteVariation = nodes[curNode].variations().length > 0
		moveList.push(<List.Item key={i}>
      <Row style={{width: '100%'}}>
        <Col span={12}>
          {moveButton(whiteToMove, curNode)}
        </Col>
        <Col span={12}>
          {moveButton((!whiteVariation || !whiteToMove) && curNode < nodes.length, curNode)}
        </Col>
      </Row>
    </List.Item>)
    // curNode += whiteVariation ? 1 : 2
	}

	return (
		<>
			<List>
        {moveList}  
      </List>
		</>
	)
}

export default MoveList