const mongoose = require('mongoose');
const { category } = require('./index');
const db = require("./index");

const initCategory = (Category) => {

    const data = [
        {
            name: "Misterior y Suspense"
        },
        {
            name: "Ciencia Ficción"
        },
        {
            name: "Comedia"
        },
        {
            name: "Terror"
        },
        {
            name: "Acción"
        },
        {
            name: "Romance"
        },
    ];

    Category.countDocuments()
    .then((count) => {
        if (count === 0) {
            data.forEach(category => {
                Category.create(category).then(docCategory => {
                    console.log('\n Created Category: \n' + docCategory);
                    return docCategory
                });
            });
        }
    })
}

module.exports = {initCategory};