const dotenv = require('dotenv');
const path = require('path');

if (process.env.NODE_ENV === 'test') {
  dotenv.config({
    path: path.resolve(process.cwd(), '.env.test'),
  });
} else {
  dotenv.config();
}
