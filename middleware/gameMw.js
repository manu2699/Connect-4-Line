module.exports = (req, res, next) => {
  const db = req.app.get("db");
  db.findOne({ _id: req.body.gameId }, (err, doc) => {
    if (err || doc === null) {
      return res.status(401).json({
        message: "No gameId found."
      });
    }
    req.game = doc;
    next();
  });
};
