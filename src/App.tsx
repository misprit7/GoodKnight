import React from 'react'
import { render } from 'react-dom'
import { GlobalStyle } from './styles/GlobalStyle'

import Greetings from './components/Greetings'
import Chessboard from './components/Chessboard'
import Viewer from './components/Viewer'

const mainElement = document.createElement('div')
mainElement.setAttribute('id', 'root')
document.body.appendChild(mainElement)

const App = () => {
  return (
    <>
      <GlobalStyle />
      {/* <Greetings /> */}
      {/* <Chessboard /> */}
      <Viewer />
    </>
  )
}

render(<App />, mainElement)
