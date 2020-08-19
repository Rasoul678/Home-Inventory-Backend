const express = require('express');
const ItemImage= require('./itemImages.model');
const middlewares = require('../../middlewares');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
require("dotenv").config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'inventory',
        format: async (req, file) => 'jpeg',
        public_id: (req, file) => file.originalname,
    },
});

const parser = multer({ storage: storage });

const router = express.Router();

router.get('/:id', middlewares.authenticateJWT, async (req, res, next) => {
    const {id} = req.params;
    try {
        const itemImages = await ItemImage.query().finder.deletedAt(false).where('item_id', id)
            .withGraphFetched('item');
        res.json(itemImages);
    } catch (error) {
        next(error);
    }
});

router.post('/', parser.single("image"), async (req, res, next) => {
    try {
        const image_url = req.file.path;
        const item_id = Number(req.body.id);
        const newItemImage = await ItemImage.query().insert({
            item_id,
            image_url
        });
        res.json(newItemImage);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', middlewares.authenticateJWT, async (req, res, next) => {
    const { role } = req.user;
    const {id} = req.params;

    if (role !== 'admin') {
        const error = new Error('Only admins are allowed.');
        res.status(403);
        next(error);
    }

    try {
        await ItemImage.query().findById(id).delete();
        res.json("Item image deleted.");
    } catch (error) {
        next(error);
    }
});

module.exports = router;