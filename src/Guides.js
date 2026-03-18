import { EnumType, Maybe } from "jazzi"

export const Guides = EnumType(
    "Guides",
    [
        "None",
        "T",
        "F",
        "I",
        "X",
        "Cross",
        "DiagonalRight",
        "DiagonalLeft"
    ]
);

export const AllGuides = Guides.range(Guides.None, Guides.DiagonalLeft);

export const getGuideLabel = (guide) => guide.match({
    None: "Sin guia",
    T: "T",
    F: "F",
    I: "I",
    X: "X",
    Cross: "+",
    DiagonalLeft: "Diagonal Izquierda",
    DiagonalRight: "Diagonal Derecha",
})

const TGuide = Maybe.Just(
    [
        [true , true , true, true , true],
        [false, false, true, false, false],
        [false, false, true, false, false],
        [false, false, true, false, false],
        [false, false, true, false, false],
    ]
)

const FGuide = Maybe.Just(
    [
        [true, true,  true, true , true],
        [true, false, false, false, false],
        [true, true,  true, true, true],
        [true, false, false, false, false],
        [true, false, false, false, false],
    ]
)

const IGuide = Maybe.Just(
    [
        [true , true,  true, true , true],
        [false, false, true, false, false],
        [false, false, true, false, false],
        [false, false, true, false, false],
        [true , true,  true, true , true],
    ]
)

const XGuide = Maybe.Just(
    [
        [true , false, false, false , true],
        [false, true , false, true , false],
        [false, false, true , false, false],
        [false, true , false, true , false],
        [true , false, false, false , true],
    ]
)

const CrossGuide = Maybe.Just(
    [
        [false, false, true, false, false],
        [false, false, true, false, false],
        [true , true , true, true , true],
        [false, false, true, false, false],
        [false, false, true, false, false],
    ]
)

const DiagonalRightGuide = Maybe.Just(
    [
        [true , false, false, false, false],
        [false, true , false, false, false],
        [false, false, true , false, false],
        [false, false, false, true , false],
        [false, false, false, false, true ],
    ]
)

const DiagonalLeftGuide = Maybe.Just(
    [
        [false, false, false, false, true ],
        [false, false, false, true , false],
        [false, false, true , false, false],
        [false, true , false, false, false],
        [true , false, false, false, false],
    ]
)

export const getGuide = guide => guide.match({
    None: Maybe.None(),
    T: TGuide,
    F: FGuide,
    I: IGuide,
    X: XGuide,
    Cross: CrossGuide,
    DiagonalRight: DiagonalRightGuide,
    DiagonalLeft: DiagonalLeftGuide,
})