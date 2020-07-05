//solution
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const validateBearerToken = require('./validate-bearer-token')
const errorHandler = require('./error-handler')
const bookmarksRouter = require('./bookmarks/bookmarks-router')

const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test'
}))
app.use(cors())
app.use(helmet())
app.use(validateBearerToken)

app.use(bookmarksRouter)

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.use(errorHandler)

module.exports = app











//original solution
// require('dotenv').config();
// const BookmarksService = require ('../src/bookmarks/bookmarks-service')
// const express = require('express');
// const morgan = require('morgan');
// const cors = require('cors');
// const helmet = require('helmet');
// const { NODE_ENV } = require('./config');
// // const bookmarksRouter = require('../src/bookmarks/bookmarks-router');

// const app = express();


// const morganOption = (NODE_ENV === 'production')
//   ? 'tiny'
//   : 'common';

// app.use(morgan(morganOption));
// app.use(cors());
// app.use(helmet());

// app.get('/bookmarks', (req, res, next) => {
//   const knexInstance = req.app.get('db')
//   BookmarksService.getAllBookmarks(knexInstance)
//    .then(bookmarks => {
//        res.json(bookmarks)
//        })
//       .catch(next)
// })

// app.get('/bookmarks/:bookmark_id', (req, res, next) => {
//   const knexInstance = req.app.get('db')
//      BookmarksService.getById(knexInstance, req.params.bookmark_id)
//        .then(bookmark => {
//          res.json(bookmark)
//        })
//        .catch(next)

// app.get('/', (req, res) => {
//     res.send('Hello, world');
// });

// app.use(function errorHandler(error, req, res, next) {
//   let response;

//   if (NODE_ENV === 'production') {
//       response = { error: {message: 'server error.'}};
//   }
//   else {
//       console.error(error);
//       response = {message: error.message, error};
//   }
//   res.status(500).json(response);
// });
// })
