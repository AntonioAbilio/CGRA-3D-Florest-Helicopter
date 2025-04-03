export function getRad(decimalDegree) {
    return (Math.PI * decimalDegree) / 180;
}


export function getZRotationMatrix(decimalDegree) {

    var rad = getRad(decimalDegree)

    return [
        Math.cos(rad), Math.sin(rad), 0, 0,
        -Math.sin(rad), Math.cos(rad), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]
}

export function getXRotationMatrix(decimalDegree) {

    var rad = getRad(decimalDegree)

    return [
        1, 0, 0, 0,
        0, Math.cos(rad), Math.sin(rad), 0,
        0, -Math.sin(rad), Math.cos(rad), 0,
        0, 0, 0, 1
    ]
}

export function getYRotationMatrix(decimalDegree) {

    var rad = getRad(decimalDegree)

    return [
        Math.cos(rad), 0, -Math.sin(rad), 0,
        0, 1, 0, 0,
        Math.sin(rad), 0, Math.cos(rad), 0,
        0, 0, 0, 1
    ]
}

export function getTranslationMatrix(xOffset, yOffset, zOffset) {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        xOffset, yOffset, zOffset, 1
    ]
}
