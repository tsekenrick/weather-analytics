// add higher order functions here
function parseMoves(s) {
    const p1 = [...s][0];
    const p2 = [...s][1];
    s = [...s].slice(2);

    const res = Object.entries(s).map((arr) => {
        if (arr[0] % 2 === 0) {
            return ({val: p1, col: arr[1]});
        } else {
            return ({val: p2, col: arr[1]});
        }
    });

    return res;
}

function shortestString(...args) {
    if (args.length === 0) { return undefined; }

    return args.reduce((acc, curStr) => {
        return curStr.length <= acc.length ? curStr : acc;
        });
}

function repeatCall(fn, n, arg) {
    if (n === 0) { return; }
    fn(arg);
    return repeatCall(fn, n-1, arg);
}

function repeatCallAllArgs(fn, n, ...args){
    if(n === 0) { return; }
    fn.apply(null, args);
    return repeatCallAllArgs(fn, n-1, ...args);

}

function steppedForEach(arr, fn, step){
    if(arr.length <= 0) { return; }
    fn(...arr.slice(0, step));
    const nextItr = arr.slice(step);
    return steppedForEach(nextItr, fn, step);
}

function constrainDecorator(fn, min, max){
    return (...args) => {
        const res = fn(...args);
        if (res > max){ return max; }
        if (res < min){ return min; }
        return res;
    };
}

function limitCallsDecorator(fn, n){
    let callCount = 0;
    return (...args) => {
        callCount += 1;
        if(callCount > n) { return; }
        return fn(...args);
    };
}

function bundleArgs(fn, ...prefArgs){
    return (...args) => fn(...prefArgs, ...args);
}

function sequence(...fns){
    return arg => fns.reduce((arg, fn) => fn(arg), arg);
}

module.exports = {
    parseMoves,
    shortestString,
    repeatCall,
    repeatCallAllArgs,
    steppedForEach,
    constrainDecorator,
    limitCallsDecorator,
    bundleArgs,
    sequence
};