
/**
 * cleanly resolves a promise, to be consumed with array destructuring
 * @param {promise} promise 
 * @returns an array containing either an error or the value of the resolved promise
 */
const resolver = async (promise) => {
    try {
        const data = await promise;
        return [data, null]
    }
    catch (err) {
        console.error(err);
        return [null, err]
    }
}
/**
 * calls a function needing error handling with the provided params
 * @param {function} callBack 
 * @param {array} params 
 * @returns an array containing either data at index 0, or an error at index 1
 */
const tryWrapper = (callBack, params) => {
    try {
        const data = callBack(...params);
        return [data, null]
    }
    catch (error) {
        console.error(error);
        return [null, error]
    }
}



module.exports = { resolver, tryWrapper };