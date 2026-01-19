import React from 'react'
import { range } from 'ramda';
import getClassName from 'getclassname'
import "./Table.scss"

const Table = (props) => {
    const { values }= props;

    const getCellClass = x => getClassName({
        base: "table__body__cell",
        "&--on": values.includes(x)
    })

    return (
    <div className="table">
        <div className="table__heading">
            {"BINGO".split("").map(value => {
                return <div key={value} className="table__heading__cell">
                    {value}
                </div>
            })}
        </div>
        <div className="table__body">
            {range(1,76).map(value => {
                return <div key={value} className={getCellClass(value)}>
                    {value}
                </div>
            })}
        </div>
    </div>)
}

export default Table