const express = require('express');

const userRoutes = require('./usersRoute');
const entryRoutes = require('./postsRoute');


const router = express.Router();

router.use('/user', userRoutes);
router.use('/post', entryRoutes);


router.get("*", (req, res, next) =>{
    res
    .status(404)
    .json({
        error: "404 not found"
    })
});

module.exports = router;