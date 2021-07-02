/* eslint @typescript-eslint/no-var-requires: "off" */
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ChessInstance, Square } from 'chess.js';
import Chessground from '../Chessground-React'
import { Col, Modal, Row } from 'antd';

import queen from './images/wQ.svg';
import rook from './images/wR.svg';
import bishop from './images/wB.svg';
import knight from './images/wN.svg';


import '../Chessground-React/assets/chessground.css'
import '../Chessground-React/assets/theme.css'

const Chess: any = require('chess.js');
// const Chess: ChessInstance = new ChessReq();

const Viewer: React.FC = () => {
  const [chess, setChess] = useState<ChessInstance>(new Chess());
  const [selectVisible, setSelectVisible] = useState<boolean>(false);
  const [fen, setFen] = useState<string>('');
  const [lastMove, setLastMove] = useState<Square[]>(['a1', 'a1']);
  const [pendingMove, setPendingMove] = useState<Square[]>(['a1', 'a1']);

  const onMove = (from: Square, to: Square) => {
    const moves = chess.moves({ verbose: true });
    for (let i = 0, len = moves.length; i < len; i++) {
      if (moves[i].flags.indexOf('p') !== -1 && moves[i].from === from) {
        setPendingMove([from, to]);
        console.log('promotion triggered')
        setSelectVisible(true);
        return;
      }
    }
    if (chess.move({ from, to, promotion: undefined })) {
      setFen(chess.fen());
      setLastMove([from, to]);
      setTimeout(randomMove, 500);
    }
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
    chess.move({ from, to, promotion: e });
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
    <div style={{ background: '#2b313c', height: '100vh' }}>
      <Row>
        <Col span={6} />
        <Col span={12} style={{ top: '10%' }}>
          <Chessground
            width="544px"
            height="544px"
            turnColor={turnColor()}
            movable={calcMovable()}
            lastMove={lastMove}
            fen={fen}
            onMove={onMove}
            style={{ margin: 'auto' }}
          />
        </Col>
        <Col span={6} />
      </Row>
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
