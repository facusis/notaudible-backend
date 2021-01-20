const express = require('express');
const mongoose = require('mongoose');
const models = require('../mongo');

const favoriteRouter = () => {
    const router = express.Router();

    router.get('/:entity/:userId/:bookId', (req, res) => {
        const entity = models[req.params.entity];
        return entity.findByUserIdAndBookId(req.params.userId, req.params.bookId).then(result => {
            if (result) {
                res.status(200).json({result})
            } else(res.status(404).json({message: 'Not found'}));
        })
    })

    router.post('/:entity/:userId', (req, res) => {
        const entity = models[req.params.entity];
        return entity.findByUserId(req.params.userId).then(result => {
            if (result) {
                res.status(200).json({result})
            } else(res.status(404).json({message: 'Not found'}));
        })
    })
}

