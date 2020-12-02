const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { Readable } = require('stream');
const models = require('../mongo');

const trackRouter = () => {
  let router = express.Router()

  router.get('/:trackID', (req, res) => {
    const trackID = req.params.trackID;

    res.set("content-type", "audio/mp3");
    res.set("accept-ranges", "bytes");

    const GridFS = Grid(mongoose.connection.db, mongoose.mongo);

    const downloadStream = GridFS.createReadStream({ _id: trackID });

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

  router.use('/', (req, res) => {

    const storage = multer.memoryStorage();

    const upload = multer({
      storage,
      limits: {
        fields: 4, //Parametros extra que le pasaremos (el name)
        fileSize: 8000000, //Tamano maximo del file
        files: 1, //numero de archivos a subir
        parts: 5 // Dos tipos de campos (el track y el name)
      }
    });

    const callback = err => {
      if (err) {
        console.log(err);
        return res.status(500).json({message: err.message});
      } else if (!req.body.name) {
        return res.status(400).json({message: 'Track name required'});
      }
      let trackName = req.body.name;

      const readableTrackStream = new Readable();
      readableTrackStream.push(req.file.buffer);
      readableTrackStream.push(null);

      const GridFS = Grid(mongoose.connection.db, mongoose.mongo);

      const writestream = GridFS.createWriteStream({
        filename: trackName
      });

      const id = writestream.id;

      readableTrackStream.pipe(writestream);

      writestream.on('error', function (error) {
        return res.status(500).json({ error });
      });

      //FUNCION PARA SUBIR EL BOOK Y REFERENCIAR 
      const uploadBookAndReference = () => {
        const book = new models.book({
          title: req.body.title,
          author: req.body.author,
          category: req.body.category,
          user: req.user.id,
          file: id
        });
    
        const user = req.user.id;
    
        return book.save().then(result => {
    
          models.category.findByIdAndUpdate(req.body.category, { $push: { books: result._id } })
    
          models.user.findByIdAndUpdate(user, { $push: { books: result._id } })
    
        }).catch((err) => {
          res.status(500).send({ error: err })
        });
      }

      writestream.on('close', function () {
        return (uploadBookAndReference(), res.status(200).json({message: 'File uploaded successfully', id}));
      });

    };
    

    upload.single('track')(req, res, callback);

  });

  return router;
}

module.exports = {
  trackRouter
}