const {...auth} = require('./authquery')  
const {...chat} = require('./chatquery')
const {...main} = require('./mainquery')
const {...profile } = require('./profilequery')

module.exports = {
  ...auth,
  ...chat,
  ...main,
  ...profile
}