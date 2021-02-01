/**
 * Sophie's helpful helper method to make translating easier. Thank you, Sophie!
 */
function translate(x, y) {
    return 'translate(' + x + ',' + y + ')';
}

/**
 *
 * @param accessor the function to apply to each element to be sorted, to access a numeric value that can be sorted.
 * @param reverse whether to reverse
 * @returns {function(*=, *=): number}
 */
function sortFunc(accessor, reverse) {
    if (reverse) {
        return function(rawA, rawB) {
            let a = accessor(rawA);
            let b = accessor(rawB);
            return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN
        }
    } else {
        return function(rawA, rawB) {
            let b = accessor(rawA);
            let a = accessor(rawB);
            return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
        }

    }
}

/**
 * Sum function to be used by reduce.
 */
let sumFunc = (accumulator, currentValue) => accumulator + currentValue;

export {translate, sortFunc, sumFunc};