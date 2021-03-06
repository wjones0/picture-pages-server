var Post = require('../models/post');
import {Router} from 'express';
var xssFilters = require('xss-filters');

const posts = Router();

// get default page size
var page_size = process.env.PAGE_SIZE || 10;


/* GET posts listing. */
posts.post('/init', function(req, res, next) {
    Post.find({ feature1: { $eq: req.body.feature1 } } )
        .sort('-_id')
        .limit(page_size)
        .exec(function(err, postData) {
            if (err) {
                res.send(err);
            }

            res.json(postData);
        });
});

// get more posts
posts.post('/more', function(req, res, next) {

    Post.find({_id: { $lt: req.body.lastID },
               feature1: { $eq: req.body.feature1 } } )
        .limit(page_size)
        .sort( '-_id' )
        .exec(function(err, postData) {
            if (err) {
                res.send(err);
            }

            res.json(postData);
        });
});


// create a new post
posts.post('/', function(req, res, next) {

   let newPost = new Post();

   newPost.screenname = xssFilters.inHTMLData(req.body.screenname);
   newPost.caption = xssFilters.inHTMLData(req.body.caption);
   newPost.picurl = xssFilters.inHTMLData(encodeURI(req.body.picurl));
   newPost.date = xssFilters.inHTMLData(req.body.date);
   newPost.feature1 = xssFilters.inHTMLData(req.body.feature1);
   newPost.feature2 = xssFilters.inHTMLData(req.body.feature2);
   newPost.feature3 = xssFilters.inHTMLData(req.body.feature3);
   newPost.yearEvent = xssFilters.inHTMLData(req.body.yearEvent);
   newPost.region = xssFilters.inHTMLData(req.body.region);
   newPost.state = xssFilters.inHTMLData(req.body.state);

   newPost.save(function(err) {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Post created' });
        });
});



export default posts;
