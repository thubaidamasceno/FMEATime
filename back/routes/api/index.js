var router = require("express").Router();
var axios = require("axios");

router.use("/user", require("./users"));
router.use("/profiles", require("./profiles"));

modulos = require("../../modules");
modulos.api.map((val) => {
  router.use(val[0], require("../../mod/" + val[1]));
});

router.use(function (err, req, res, next) {
  if (err.name === "ValidationError") {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function (errors, key) {
        errors[key] = err.errors[key].message;

        return errors;
      }, {}),
    });
  }

  return next(err);
});

router.post("/proxy", function (req, res,next) {
  return axios(req.body)
    .then((response) => {
      // console.log(response);
      res.send(response.data);
    })
    .catch((e) => {
      console.log({ erro:req.body });
      console.log({ erro: e });
      next();
    });
});

module.exports = router;
