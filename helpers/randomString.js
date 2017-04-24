const uuid = require('uuid/v4');

const file = () => [uuid(), Date.now()].join('-');

const diffTime = (start) => {
    const finish = process.hrtime(start);
    return ((finish[0] * 1e6) + finish[1]) / 1e6;
}

module.exports.file = file;
module.exports.diffTime = diffTime;