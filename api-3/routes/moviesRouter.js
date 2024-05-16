const express = require('express');
const { moviesController } = require('../controllers/moviesController');

const router = express.Router();


router.get("/", moviesController.getAll);
router.get("/:id", moviesController.getById); //:id dışarıdan aldığı id parametresi
router.delete("/:id", moviesController.deleteById);
router.post("/", moviesController.add);
router.put("/:id", moviesController.update);


module.exports = router;