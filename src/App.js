import { useLayoutEffect, useState } from 'react'
import { complement, equals, reverse, tail, take, compose, path } from 'ramda'
import { Either, Maybe } from 'jazzi'
import getClassName from 'getclassname'
import { database, auth } from './firebase'
import { mkGen } from './core'
import Table from './Table'
import useDevice from './hooks/useDevice'
import logo from './latir.jpeg'
import Button from './Button'
import Bingo from './Bingo'
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

  const [bingo, setBingo] = useState()
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const handleChange = compose( setValue, path(["target","value"]))
  const handleSubmit = e => {
    Maybe.fromEmpty(value)
      .effect((code) => {
        setLoading(true)
        auth.signInAnonymously()
          .then(() => database.ref(`/bingos/${code}`).once("value"))
          .then((snap) => {
            Maybe.fromPredicate(() => snap.exists(), snap.val())
              .map((b) => b.split(",").map(Number))
              .effect(setBingo)
              .onNone(() => {
                alert("No se encontro bingo")
                setBingo()
              })
          }).finally(() => {
            setValue('')
            setLoading(false)
          })
      })
  }


  useLayoutEffect(() => {
    device.match({
      Mobile: () => setHist(8),
      _: () => setHist(15)
    })
  },[device])

  const root = getClassName({ base: "container" })
  const controls = root.extend("&__controls");
  const buttonClass = controls.extend("&__button")
  const verifyContainer = root.extend("&__verification")
  const verifyInput = verifyContainer.extend("&__input")

  const pastBallots = gen.peak();
  const bingoData = pastBallots.reduce((acc,next) => ({...acc, [next]: true }),{})
  return (
    <div className={root}>
      <Table values={pastBallots}/>
      <div className={controls}>
        <button className={buttonClass} onClick={handleNext}>Siguiente</button>
        <button className={buttonClass} onClick={handleReset}>Reset</button>
        <h1>Actual: {toBingoBallot(latest)}</h1>
        <h1>Historial (Total: {pastBallots.length})</h1>
        <ul>
          {history(hist)(pastBallots).map(x => <li key={x}>{toBingoBallot(x)}</li>)}
        </ul>
        <div className="latir">
          <img src={logo} className="latir__logo" alt="logo"/>
        </div>
      </div>
      <div className={verifyContainer}>
        <input 
          id="code" 
          placeholder="Codigo de bingo..." 
          value={value} 
          onChange={handleChange}
          className={verifyInput}
        />
        <Button loading={loading} onClick={handleSubmit}>Mostrar</Button>
        {bingo && <Bingo bingo={bingo} selected={bingoData}/>}
      </div>
    </div>
  );
}

export default App;
