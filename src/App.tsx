import React from 'react'
import { render } from 'react-dom'
import { GlobalStyle } from './styles/GlobalStyle'

import './App.css';
import './Components/Chessground/assets/chessground.css'
import './Components/Chessground/assets/theme.css'

import Greetings from './components/Greetings'
import Chessboard from './components/Chessboard'
import Viewer from './components/Viewer'
import Chessground from './components/Chessground';

const mainElement = document.createElement('div')
mainElement.setAttribute('id', 'root')
document.body.appendChild(mainElement)

const App = () => {
  return (
    <>
      <GlobalStyle />
      {/* <Greetings /> */}
      {/* <Chessboard /> */}
      {/* <Viewer /> */}
      <Chessground
        width="448px"
        height="448px"
        style={{ margin: 'auto' }}
      />
    </>
  )
}

render(<App />, mainElement)
