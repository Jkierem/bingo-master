import React from 'react'
import { range } from 'ramda';
import getClassName from 'getclassname'
import "./Table.scss"
import logo from './latir.jpeg'

const Table = (props) => {
    const { values }= props;

    const getCellClass = x => getClassName({
        base: "table__body__cell",
        "&--on": values.includes(x)
    })

    return (
    <div className="table">
        <div className="table__heading">
            {"LATIR".split("").map(value => {
                return <div className="table__heading__cell">
                    {value}
                </div>
            })}
        </div>
        <div className="table__body">
            {range(1,76).map(value => {
                return <div className={getCellClass(value)}>
                    {value}
                </div>
            })}
        </div>
        <div className="table__logo">
            <img src={logo} className="latir" alt="logo"/>
        </div>
    </div>)
}

export default Table