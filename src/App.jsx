import { useLayoutEffect, useMemo, useState } from 'react'
import { complement, equals, reverse, tail, take, compose, path } from 'ramda'
import { Either, Maybe } from 'jazzi'
import getClassName from 'getclassname'
import { database, auth } from './firebase'
import { mkGen } from './core'
import Table from './Table'
import useDevice from './hooks/useDevice'
import Button from './Button'
import Bingo, { BingoGuide } from './Bingo'
import logo from "./logo.png"
import "./App.scss"
import { AllGuides, getGuide, getGuideLabel, Guides } from './Guides'

const gen = mkGen()
const neq = complement(equals)

const history = (x=15) => compose( take(x), tail, reverse )

const toBingoBallot = x => {
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

  const handleClean = () => setBingo()
  
  const [guide, setGuide] = useState(Guides.None);
  
  const handleChangeGuide = (e) => {
    setGuide(Guides.toEnum(e.target.value))
  }

  const maybeGuide = useMemo(() => getGuide(guide), [guide]);

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
  const guideContainer = root.extend("&__guide")
  const guideSelect = guideContainer.extend("&__select")

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
        <div className="auna">
          <img src={logo} className="auna__logo" alt="logo"/>
        </div>
      </div>
      <div className={guideContainer}>
        <select 
          id="guide"
          className={guideSelect}
          value={Guides.fromEnum(guide)}
          onChange={handleChangeGuide}
        >
          {AllGuides.map((guide) => {
            return <option 
              value={Guides.fromEnum(guide)} 
              key={getGuideLabel(guide)}
            >{getGuideLabel(guide)}</option>
          })}
        </select>
        {maybeGuide.match({
          Just: guide => <BingoGuide guide={guide} />,
          None: () => <></>
        })}
      </div>
      <div className={verifyContainer}>
        <input 
          id="code" 
          placeholder="Identificador de bingo..." 
          value={value} 
          onChange={handleChange}
          className={verifyInput}
        />
        <Button loading={loading} onClick={handleSubmit}>Buscar</Button>
        <Button onClick={handleClean}>Limpiar</Button>
        {bingo && <Bingo bingo={bingo} selected={bingoData}/>}
      </div>
    </div>
  );
}

export default App;
