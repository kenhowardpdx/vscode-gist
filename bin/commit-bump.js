const { commit } = require('node-git-utils');
const { bumpMessage } = require('./bump-msg');

commit(bumpMessage);
