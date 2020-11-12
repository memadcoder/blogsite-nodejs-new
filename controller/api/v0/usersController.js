const Users = require("../../../model/usersModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//get all users
module.exports.getUsers = (req, res, next) => {
  console.log("get all Users\n");
   Users.find()
     .then((users) => {

       res.status(200).json({
         message: "Users",
         users,
       });
     })
     .catch((error) => {
       console.log(error);
       res.status(500).json({
         message: "Error on getting Users.",
       });
     });
};

//create new user
module.exports.createUser = (req, res, next) => {
  console.log(req.body);
  let email = req.body.email;
  let userName = req.body.username;
  let password = req.body.password;
  username = userName.toLowerCase();
  email = email.toLowerCase();

  Users.findOne({
    $or: [{ username: username }, { email: email }],
  }).then((user) => {
    if (user) {
      //user already exist
      let errorMessage = "This Email has an account, Please Log in";
      if (username == user.username) {
        errorMessage = "username already Used, Please try another username";
      }
      res.status(400).json({
        error: errorMessage,
        username,
        email,
      });
    } else {
      bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          let aUser = new Users({
            username,
            email,
            password: hashedPassword,
          });
          return aUser.save();
        })
        .then((newUser) => {
          res.status(200).json({
            message: "User created.",
            user: {
              username: newUser.username,
              email: newUser.email,
            },
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({
            message: "Some error occured",
            error: error,
          });
        });
    }
  });
};


//delete user by userId
module.exports.deleteById = (req, res, next) => {
  console.log("delete\n");

  let userId = req.params.userId;

  Users.findById(userId).then((user) => {
    console.log(user);
    if (user) {
        Users.findByIdAndDelete(userId).then((deleted) => {
          res.status(200).json({
            message: "User Deleted.",
            id: deleted._id,
          });
        });

    } else {
      res.status(400).json({
        message: "No user exist.",
      });
    }
  });
};



//edit post title and content
module.exports.updateUser = (req, res, next) => {
 
  console.log("update User\n");

  let email = req.body.email;
  let password = req.body.password;

  Users.updateMany({ _id: req.params.userId }, { $set: { email, password } })
    .then((result) => {
      res.status(200).json({
        message: "User Updated",
        result,
      });
    })
    .catch((err) => {
      res.status(401).json({
        message: "Some error occured",
      });
    });
};

//login
module.exports.login = (req, res, next) => {
  let usernameOrEmail = req.body.userNameOrEmail;
  let password = req.body.password;

  usernameOrEmail = usernameOrEmail.toLowerCase();

  Users.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  }).then((user) => {
    if (user) {
      // console.log(user);
      bcrypt.compare(password, user.password).then((isMatched) => {
        if (isMatched) {
          const token = jwt.sign(
            {
              email: user.email,
              username: user.username,
              userId: user._id,
            },
            "ThisIsASecretKeyAndKey"
          );

          res.status(200).json({
            message: "Login successed",
            username: user.username,
            userId: user._id,
            email: user.email,
            isAdmin: user.isAdmin,
            token: token,
          });
        } else {
          res.status(400).json({
            message: "Password is incorrect.",
          });
        }
      });
    } else {
      res.status(400).json({
        message: "No User matching the request.",
      });
    }
  });
};




