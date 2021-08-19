const express= require('express');
const router=express.Router();

const Middlewares=require('../middleware/cache');

const Controller= require('../controllers/translate_controller');

// checking in cache if tranlated text already exists
router.post('/translate',Middlewares.cache,Controller.translateText);

module.exports=router;