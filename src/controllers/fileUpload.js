const { Router } = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { Readable } = require('stream');

// not sure if this step is necessary...
// const db = new mongo.Db('app', new mongo.Server("127.0.0.1", 27017));


const bookRouter = Router();

// get a single audiobook from the database
bookRouter.get('/:bookID', (req, res) => {
  const bookID = req.params.bookID;

  res.set("content-type", "audio/mp3");
  res.set("accept-ranges", "bytes");

  const GridFS = Grid(mongoose.connection.db, mongoose.mongo);

  const downloadStream = GridFS.createReadStream({ _id: bookID });

  downloadStream.on('data', chunk => {
    res.write(chunk);
  });

  downloadStream.on('error', () => {
    res.sendStatus(404);
  });

  downloadStream.on('end', () => {
    res.end();
  });

});

// upload a single audiobook 
bookRouter.post('/', (req, res) => {
  // Definiendo storage en memoria
  const storage = multer.memoryStorage();

  //Configurando multer
  const upload = multer({
    storage,
    limits: {
      fields: 1, //Parametros extra que le pasaremos (el name)
      fileSize: 300000000, //Tamano maximo del file
      files: 1, //numero de archivos a subir
      parts: 2 // Dos tipos de campos (el track y el name)
    }
  });

  const callback = err => {
    if (err) {
      console.log(err);
      return res.status(500).json({message: err.message});
    } else if (!req.body.name) {
      return res.status(400).json({message: 'Book name required'});
    } 
    let bookName = req.body.name;
    const readableFileStream = new Readable();
    readableFileStream.push(req.file.buffer);
    readableFileStream.push(null);

 // when and how to link it to my mongodb???
    const GridFS = Grid(mongoose.connection.db, mongoose.mongo);

    const writeStream = GridFS.createWriteStream({
      filename: bookName
    });

    const id = writeStream.id;

    readableFileStream.pipe(writeStream);

    writeStream.on('error', function (error) {
      return res.status(500).json({ error });
    });

    writeStream.on('close', function (file) {
      return res.status(201).json({message: 'File uploaded successfully', id});
    });

  };


  upload.single('book') (req, res, callback);


});


// module.exports = bookRouter;