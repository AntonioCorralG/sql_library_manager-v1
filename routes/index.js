const express = require('express');
const book = require('../models/book');
const router = express.Router();
var Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}
/* GET home page. */
router.get('/', asyncHandler(async (req, res, next) => {
  res.redirect("/books");
}));

/* Get full list of books. */
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  console.log(books);
  res.render('index', { books, title: "Books"});
}));

//gets books create new book form
router.get('/books/new', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
     res.render("new-book");      

  // }
}));


//creates a new book in the database
router.post('/books/new', asyncHandler(async (req, res) => {
  let books;
  try {
    books = await Book.create(req.body);
    res.redirect("/books"); 
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      books = await Book.build(req.body);
      books.id = req.params.id;
      res.render("new-book", { books, errors: error.errors, title: "New Book" })
    } else {
      throw error;
    }
  }
}));

//shows the book details
router.get('/books/:id', asyncHandler(async (req, res) => {
  const books = await Book.findByPk(req.params.id);
  if(books) {
    res.render("update-book", { books, title: 'Update Book'});      
  } else {
    res.sendStatus(404);
  }
}));

//updates book info in the databse
router.post('/books/:id', asyncHandler(async (req, res, next) => {
  let books;
  try {
    books = await Book.findByPk(req.params.id);
    if (books) {
      await books.update(req.body);
      res.redirect('/books')
    } else {
      next();
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      books = await Book.build(req.body);
      books.id = req.params.id;
      res.render("update-book", { books, errors: error.errors, title: "Update Book" })
    } else {
      throw error;
    }
  }
}));

//delete book info in the databse
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
    const books = await Book.findByPk(req.params.id);
    if (books) {
      await books.destroy();
      res.redirect('/books');
    } else {
      res.sendStatus(404);
    }
 
}));




module.exports = router;
