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


module.exports = { resolver };