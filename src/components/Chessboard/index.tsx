import React from 'react'
import { Container } from './styles'

import Chessground from 'react-chessground'
import 'react-chessground/dist/styles/chessground.css'

const Chessboard: React.FC = () => {
  return (
    <Container>
      <Chessground/>
    </Container>
  )
}

export default Chessboard
