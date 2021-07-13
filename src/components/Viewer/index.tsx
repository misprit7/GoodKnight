/* eslint @typescript-eslint/no-var-requires: "off" */
import React, { useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import { ChessInstance, Square } from 'chess.js';
import Chessground from '../Chessground-React';
import { Button, Col, Modal, Row, Space } from 'antd';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';

import queen from './images/wQ.svg';
import rook from './images/wR.svg';
import bishop from './images/wB.svg';
import knight from './images/wN.svg';

import '../Chessground-React/assets/chessground.css';
import '../Chessground-React/assets/theme.css';

const Chess: any = require('chess.js');
// const Chess: ChessInstance = new ChessReq();

var kokopu = require('kokopu');

// import {Pgn} from "cm-pgn"

type ViewerProps = {
  position: any;
  nextMove: () => void;
  prevMove: () => void;
  nextEnable: boolean;
  prevEnable: boolean;
};

const Viewer = (props: ViewerProps) => {
  const [chess, setChess] = useState<ChessInstance>(new Chess());
  const [selectVisible, setSelectVisible] = useState<boolean>(false);
  const [fen, setFen] = useState<string>('');
  const [lastMove, setLastMove] = useState(['a1', 'a1']);
  const [pendingMove, setPendingMove] = useState(['a1', 'a1']);

  const onMove = (from: string, to: string) => {
    // const moves = chess.moves({ verbose: true });
    const moves = new kokopu.Position(fen);
    for (let i = 0, len = moves.length; i < len; i++) {
      if (moves[i].isPromotion()) {
        setPendingMove([from, to]);
        console.log('promotion triggered');
        setSelectVisible(true);
        return;
      }
    }
    // if (chess.move({ from, to, promotion: undefined })) {
    //   setFen(chess.fen());
    //   setLastMove([from, to]);
    //   setTimeout(randomMove, 500);
    // }
  };

  const randomMove = () => {
    const moves = chess.moves({ verbose: true });
    const move = moves[Math.floor(Math.random() * moves.length)];
    if (moves.length > 0) {
      chess.move(move.san);
      setFen(chess.fen());
      setLastMove([move.from, move.to]);
    }
  };

  const promotion = (e: 'b' | 'q' | 'n' | 'r' | undefined) => {
    const from = pendingMove[0];
    const to = pendingMove[1];
    // chess.move({ from, to, promotion: e });
    setFen(chess.fen());
    setLastMove([from, to]);
    setSelectVisible(false);
    setTimeout(randomMove, 500);
  };

  const turnColor = () => {
    return chess.turn() === 'w' ? 'white' : 'black';
  };

  const calcMovable = () => {
    const dests = new Map();
    chess.SQUARES.forEach((s) => {
      const ms = chess.moves({ square: s, verbose: true });
      if (ms.length)
        dests.set(
          s,
          ms.map((m) => m.to)
        );
    });
    return {
      free: false,
      dests,
      color: 'white',
    };
  };

  return (
    <div style={{width: '100%'}}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Row style={{position: 'relative', width:'100%'}}>
          <Chessground
            width={'100%'}
            height={'100%'}
            turnColor={props.position.turn()}
            movable={calcMovable()}
            lastMove={lastMove}
            fen={props.position.fen()}
            onMove={onMove}
            style={{ position: 'absolute' }}
          />
          {/* <div style={{position: 'absolute', width: '100%', height: '100%'}}/> */}
          <div style={{display: 'block', paddingBottom: '100%'}}></div>
        </Row>
        <Row style={{ textAlign: 'center' }}>
          <Col span={8}>
            <Button
              size="large"
              block
              onClick={props.prevMove}
              disabled={!props.prevEnable}
            >
              <CaretLeftOutlined />
            </Button>
          </Col>
          <Col span={8}></Col>
          <Col span={8}>
            <Button
              size="large"
              block
              onClick={props.nextMove}
              disabled={!props.nextEnable}
            >
              <CaretRightOutlined />
            </Button>
          </Col>
        </Row>
      </Space>
      <Modal visible={selectVisible} footer={null} closable={false}>
        <div style={{ textAlign: 'center', cursor: 'pointer' }}>
          <span role="presentation" onClick={() => promotion('q')}>
            <img src={queen} alt="" style={{ width: 50 }} />
          </span>
          <span role="presentation" onClick={() => promotion('r')}>
            <img src={rook} alt="" style={{ width: 50 }} />
          </span>
          <span role="presentation" onClick={() => promotion('b')}>
            <img src={bishop} alt="" style={{ width: 50 }} />
          </span>
          <span role="presentation" onClick={() => promotion('n')}>
            <img src={knight} alt="" style={{ width: 50 }} />
          </span>
        </div>
      </Modal>
    </div>
  );
};

export default Viewer;
