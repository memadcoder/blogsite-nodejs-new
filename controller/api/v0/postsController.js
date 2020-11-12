const Posts = require("../../../model/postsModel");

module.exports.getPosts = (req, res, next) => {
  console.log("get all posts\n");
  Posts.find()
    .sort({ createdAt: -1 })
    .populate("by", "name username")
    .then((posts) => {
      res.status(200).json({
        message: "Posts",
        posts,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error on getting Entries.",
      });
    });
};

//get post by postId
module.exports.getPostById = (req, res, next) => {
  console.log("get single post\n");

  let entryId = req.params.entryId;

  Posts.findById(entryId)
    .then((entry) => {
      if (entry) {
        res.status(200).json({
          message: "Post found",
          post: entry,
        });
      } else {
        res.status(404).json({
          message: "Post not found",
        });
      }
    })
    .catch((err) => {
      res.status(404).json({
        message: "Error",
      });
    });
};

module.exports.createPost = (req, res, next) => {
  console.log("create new post\n");
  console.log("post request from", req.user);
  console.log("body==>", req.body);

  let title = req.body.title;
  let content = req.body.content;
  let by = req.user;

  let aPost = new Posts({
    title,
    content,
    by,
  });

  aPost.save().then((newPost) => {
    res.status(200).json({
      message: "New post Created.",
      newPost,
    });
  });
};

//delete post by postId
module.exports.deleteById = (req, res, next) => {
  console.log("delete\n");

  let entryId = req.params.entryId;

  Posts.findById(entryId).then((entry) => {
    console.log(entry);
    if (entry) {
      Posts.findByIdAndDelete(entryId).then((deleted) => {
        res.status(200).json({
          message: "Post Deleted.",
          id: deleted._id,
        });
      });
    } else {
      res.status(400).json({
        message: "No entry exist.",
      });
    }
  });
};

//edit post title and content
module.exports.updatePost = (req, res, next) => {
  console.log("update post\n");

  let title = req.body.title;
  let content = req.body.content;

  Posts.updateMany({ _id: req.params.entryId }, { $set: { title, content } })
    .then((result) => {
      res.status(200).json({
        message: "Post Updated",
        result,
      });
    })
    .catch((err) => {
      res.status(401).json({
        message: "Some error occured",
      });
    });
};

//get posts by username
module.exports.getPostsByUserName = async (req, res, next) => {
  console.log("request userdetail from user==>", req.params);
  let username = req.params.userName;

  let offset = parseInt(req.query.offset) | 0;
  let limit = parseInt(req.query.limit) | 20;
  let totalEntries;

  let loggedIn = req.user;
  var blockLists;

  if (loggedIn) {
    blockLists = await User.findById(req.user._id).then((user) => {
      return user.blockedUsers;
    });
  } else {
    blockLists = [];
  }

  let username_lower = username.toLowerCase();

  User.findOne({
    username_lower,
  })
    .select("-password -username_lower -blockedUsers")
    .then((user) => {
      if (user) {
        user = user.toObject();
        if (blockLists.includes(user._id)) {
          user.isBlocked = true;
        } else {
          user.isBlocked = false;
        }
        Entry.countDocuments({
          by: user._id,
        }).then((count) => {
          totalEntries = count;
          Entry.find({
            by: user._id,
          })
            .sort({ createdAt: -1 })
            .skip(offset * limit)
            .limit(limit)
            .populate("by", "name username")
            .then((entries) => {
              res.status(200).json({
                message: "User Information with entries",
                user,
                totalEntries,
                entries,
              });
            });
        });
      } else {
        res.status(400).json({
          message: "No User in the System.",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error on Finding user.",
      });
    });
};

//get only featured post
module.exports.getFeaturedPost = (req, res, next) => {
  console.log("get featured posts\n");

  Posts.find({ featured: true })
    .then((entry) => {
      if (entry.length != 0) {
        res.status(200).json({
          message: "featured Posts",
          post: entry,
        });
      } else {
        res.status(404).json({
          message: "there is not any post featured",
        });
      }
    })
    .catch((err) => {
      res.status(404).json({
        message: "Error",
      });
    });
};

//get one last post
module.exports.getLatestPost = (req, res, next) => {
  console.log("get latest post\n");

  Posts.findOne()
    .sort({ createdAt: -1 })
    .populate("by", "name username")
    .then((entry) => {
      if (entry.length != 0) {
        res.status(200).json({
          message: "latest Post",
          post: entry,
        });
      } else {
        res.status(404).json({
          message: "there is not any post featured",
        });
      }
    })
    .catch((err) => {
      res.status(404).json({
        message: "Error",
      });
    });
};

//get five recent post
module.exports.getRecentPosts = (req, res, next) => {
  console.log("get 5 recent posts\n");

  Posts.find()
    .sort({ createdAt: -1 })
    .populate("by", "name username")
    .limit(5)
    .then((entry) => {
      if (entry.length != 0) {
        res.status(200).json({
          message: "recent Posts",
          posts: entry,
        });
      } else {
        res.status(404).json({
          message: "there is not any recent post",
        });
      }
    })
    .catch((err) => {
      res.status(404).json({
        message: "Error",
      });
    });
};
