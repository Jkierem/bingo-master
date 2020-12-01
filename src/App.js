import { useLayoutEffect, useState } from 'react'
import { complement, equals, reverse, tail, take, compose } from 'ramda'
import { Either } from 'jazzi'
import getClassName from 'getclassname'
import { mkGen } from './core'
import Table from './Table'
import useDevice from './hooks/useDevice'
import logo from './latir.jpeg'
import "./App.scss"

const gen = mkGen()
const neq = complement(equals)

const history = (x=15) => compose( take(x), tail, reverse )

const toBingoBallot = x => {
  return Either
  .fromPredicate(neq(undefined),x)
  .flatMap(x => Either.fromPredicate(neq(-1),x))
  .map(x => {
    if( x <= 15 ){
      return "L"
    } else if( x <= 30) {
      return "A"
    } else if( x <= 45) {
      return "T"
    } else if( x <= 60) {
      return "I"
    } else {
      return "R"
    }
  })
  .map(l => `${l}${x}`)
  .onLeft(() => "--")
}

function App() {
  const [latest, setLatest] = useState(undefined)
  const [hist, setHist] = useState(15)
  const device = useDevice()
  const handleNext = () => setLatest(gen.generate())
  const handleReset = () => {
    gen.reset()
    setLatest(undefined)
  }


  useLayoutEffect(() => {
    if( device.isMobile() ){
      setHist(8)
    } else {
      setHist(15)
    }
  },[device])

  const root = getClassName({ base: "container" })
  const controls = root.extend("&__controls");
  const buttonClass = controls.extend("&__button")

  return (
    <div className={root}>
      <Table values={gen.peak()}/>
      <div className={controls}>
        <button className={buttonClass} onClick={handleNext}>Siguiente</button>
        <button className={buttonClass} onClick={handleReset}>Reset</button>
        <h1>Actual: {toBingoBallot(latest)}</h1>
        <h1>Historial (Total: {gen.peak().length})</h1>
        <ul>
          {history(hist)(gen.peak()).map(x => <li key={x}>{toBingoBallot(x)}</li>)}
        </ul>
        <div className="latir">
          <img src={logo} className="latir__logo" alt="logo"/>
        </div>
      </div>
    </div>
  );
}

export default App;
