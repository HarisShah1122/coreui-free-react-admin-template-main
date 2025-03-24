module.exports.unauthenticateUser = function unauthenticateUser(
  req,
  res,
  next
) {
  var session = req.session;
  console.log(session.username);
  if (session.username) {
    res.redirect("/home");
  } else {
    next();
  }
};

module.exports.authenticateUser = function authenticateUser(req, res, next) {
  var session = req.session;
  console.log("authenticateUser");
  console.log(session.username);

  if (session.username) {
    next();
  } else {
    res.redirect("/login");
  }
};
