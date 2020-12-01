import { IO, Maybe } from "jazzi"

const randomInteger = (min,max) => {
    return Math.floor((Math.random() * (max - min)) + min)
}

const Random = IO.of(() => randomInteger(1,76))

const LIMIT = 75;

export const mkGen = () => {
    let mem = []
    const find = y => Maybe.of(mem.find(x => x === y))
    const generate = () => {
        return Maybe
        .of(mem.length < LIMIT)
        .map(() => Random.map( x => {
                return find(x)
                .map(generate)
                .onNone(() => {
                    mem.push(x)
                    return x
                })
            }).run()
        )
        .onNone(-1)
    }
    const reset = () => { mem = [] }
    return {
        generate,
        reset,
        peak(){
            return mem
        },
    }
}