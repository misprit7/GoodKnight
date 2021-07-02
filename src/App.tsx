import React from 'react'
import { render } from 'react-dom'
import { GlobalStyle } from './styles/GlobalStyle'

import './App.css';
import './components/Chessground-React/assets/chessground.css'
import './components/Chessground-React/assets/theme.css'

import Viewer from './components/Viewer'

const mainElement = document.createElement('div')
mainElement.setAttribute('id', 'root')
document.body.appendChild(mainElement)

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Viewer />
    </>
  )
}

render(<App />, mainElement)
