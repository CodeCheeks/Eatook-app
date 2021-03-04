const Restaurant = require("../models/Restaurant.model");
const Like = require("../models/Like.model");


module.exports.home = (req, res, next) => {
    Restaurant.find()
      .populate("likes")
      .then((restaurants) => {
        res.render("home", {restaurants: restaurants.map((r, i) => {
            r = r.toJSON();
            r.likeCount = r.likes.length;
            r.disabled = req.user ? r.owner.toString() === req.user._id.toString() : true;
            r.likedByUser = req.user ? r.likes.some((l) => l.user.toString() == req.user._id.toString()): false;
            return r;
          }),
        });
      })
      .catch((e) => next(e));
  };


module.exports.about = (req,res,next) => {
    res.render('about')
}



module.exports.like = (req, res, next) => {
    
    Like.findOne({ restaurant: req.params.id, user: req.user._id })
      .then((like) => {
        if (!like) {
          return Like.create({
            restaurant: req.params.id,
            user: req.user._id,
          }).then(() => {
            // Dándole a like
            res.json({ add: 1 });
          });
        } else {
          return Like.findByIdAndDelete(like._id).then(() => {
            // Dándole a dislike
            res.json({ add: -1 });
          });
        }
      })
      .catch((e) => next(e));
  };
  