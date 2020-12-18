const router = require('express').Router();
const StoreService = require('./service');
const Response = require('../dto/response');

const storeService = new StoreService();

router.get('/', async function (req, res) {
  try {
    const condition = req.query.condition || '{}';
    const parsedCondition = JSON.parse(condition);
    const matchedConfiguration = await storeService.select({
      _userId: req.user.id,
      ...parsedCondition
    });

    const payload = new Response('Configurations', matchedConfiguration);
    res.json(payload);
  } catch (e) {
    console.log(e);
    const payload = new Response('Invalid Properties');
    res.status(400).json(payload);
  }
});

router.post('/', async function (req, res) {
  try {
    if(!Object.keys(req.body).length){
      throw new Error('Empty Configuration');
    }

    // _userId in after ...req.body for security
    const configuration = {...req.body,  _userId: req.user.id};
    const id = await storeService.insert(configuration);

    const payload = new Response('Configurations', {id});
    res.json(payload);
  } catch (e) {
    const payload = new Response('Can\'t Add Configurations');
    res.status(400).json(payload);
  }
});

router.put('/', async function (req, res) {
  try {
    if(!Object.keys(req.body).length){
      throw new Error('Empty Configuration');
    }

    req.body.assignment = req.body.assignment || {};

    // _userId in after ...req.body for security
    const condition = {...req.body.condition,  _userId: req.user.id};
    const assignment = req.body.assignment;

    if(req.body.delete && req.body.delete.constructor.name == 'Array'){
      for(const property of req.body.delete){
        assignment[property] = undefined;
      }
    }

    const updatedConfigurations = await storeService.update(assignment, condition);
    const payload = new Response('Configurations', updatedConfigurations);
    res.json(payload);
  } catch (e) {
    console.log(e);
    const payload = new Response('Can\'t Add Configurations');
    res.status(400).json(payload);
  }
});

router.delete('/', async function (req, res) {
  try {
    if(!Object.keys(req.body).length){
      throw new Error('Empty Configuration');
    }

    // _userId in after ...req.body for security
    const condition = {...req.body,  _userId: req.user.id};
    const deletedConfigurations = await storeService.delete(condition);

    const payload = new Response('Configurations', deletedConfigurations);
    res.json(payload);
  } catch (e) {
    const payload = new Response('Can\'t Add Configurations');
    res.status(400).json(payload);
  }
});

module.exports = router;
