import preval from 'preval.macro';
export const imageFiles = preval
    ` const fs = require('fs');
  const files = fs.readdirSync('public/img');
  module.exports = files;
`