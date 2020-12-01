import { Either } from 'jazzi'
import { complement, equals, reverse, tail, take, compose } from 'ramda'
import { useState } from 'react'
import { mkGen } from './core'
import Table from './Table'
import "./App.scss"
import getClassName from 'getclassname'

const gen = mkGen()
const neq = complement(equals)

const history = compose( take(15), tail, reverse )

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
  const handleNext = () => setLatest(gen.generate())
  const handleReset = () => {
    gen.reset()
    setLatest(undefined)
  }

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
          {history(gen.peak()).map(x => <li key={x}>{toBingoBallot(x)}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default App;
