const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.log('Përdorim: node hashPassword.js "passwordi_yt"');
  process.exit(1);
}

bcrypt.hash(password, 12).then(hash => {
  console.log('\nHash-i i ri:\n');
  console.log(hash);
  console.log('\nKopjoje string-un e mësipërm te SQL UPDATE.\n');
});