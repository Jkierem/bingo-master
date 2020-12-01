import { Either, Maybe } from 'jazzi'
import { complement, equals } from 'ramda'
import { useState } from 'react'
import { mkGen } from './core'

const gen = mkGen()
const neq = complement(equals)

const getLatestMessage = x => {
  return Either
  .fromPredicate(neq(undefined),x)
  .flatMap(x => Either.fromPredicate(neq(-1),x))
  .map(x => {
    if( x <= 15 ){
      return "B"
    } else if( x <= 30) {
      return "I"
    } else if( x <= 45) {
      return "N"
    } else if( x <= 60) {
      return "G"
    } else {
      return "O"
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

  return (
    <div>
      <div>Table goes here</div>
      <div>
        Controls go here
        <div>
          <button onClick={handleNext}>Siguiente</button>
          <button onClick={handleReset}>Reset</button>
          <h1>Latest: {getLatestMessage(latest)}</h1>
          <h1>Historial</h1>
          <ol>
            {gen.peak().map(x => <li key={x}>{x}</li>)}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default App;
