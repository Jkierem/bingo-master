import React from 'react'
import { range } from 'ramda';
import getClassName from 'getclassname'
import "./Table.scss"

const Bingo = (props) => {
    const { bingo, selected } = props

    const getCellClass = x => getClassName({
        base: "bingo_table__body__cell",
        "&--on": selected[x]
    })

    return (
    <div className="bingo_table">
        <div className="bingo_table__heading">
            {"BINGO".split("").map((value) => {
                return <div key={value} className="bingo_table__heading__cell">
                    {value}
                </div>
            })}
        </div>
        <div className="bingo_table__body">
            {range(0,25).map((value,idx) => {
                return <div key={idx} className={getCellClass(bingo[value])} >
                    {bingo[value]}
                </div>
            })}
        </div>
    </div>)
}

export default Bingo