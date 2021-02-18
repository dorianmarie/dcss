const { Router } = require('express');
const router = Router();
const {
  // Use for restricting access to only authed users.
  requireUser
} = require('../session/middleware');
const { validateRequestBody } = require('../../util/requestValidation');
const { requireUserRole } = require('../roles/middleware');
const { requireScenarioUserRole } = require('../scenarios/middleware');
const {
  getPersonas,
  getPersonasByUserId,
  createPersona,
  getPersonasByScenarioId,
  getPersonaById,
  setPersonaById,
  deletePersonaById,
  linkPersonaToScenario,
  unlinkPersonaFromScenario
} = require('./endpoints');

router.get('/', [requireUser, getPersonas]);

router.post('/', [
  requireUser,
  requireUserRole(['admin', 'super_admin', 'facilitator']),
  createPersona
]);

router.get('/my', [requireUser, getPersonasByUserId]);

router.get('/user/:id', [requireUser, getPersonasByUserId]);

router.get('/scenario/:id', [requireUser, getPersonasByScenarioId]);

router.get('/:id', [requireUser, getPersonaById]);

router.put('/:id', [
  requireUser,
  requireUserRole(['admin', 'super_admin', 'facilitator']),
  validateRequestBody,
  setPersonaById
]);

// router.delete('/:id', [
//   requireUser,
//   requireUserRole(['admin', 'super_admin', 'facilitator']),
//   deletePersonaById
// ]);

router.get('/link/:id/scenario/:scenario_id', [
  requireUser,
  requireScenarioUserRole(['owner', 'author']),
  linkPersonaToScenario
]);

router.get('/unlink/:id/scenario/:scenario_id', [
  requireUser,
  requireScenarioUserRole(['owner', 'author']),
  unlinkPersonaFromScenario
]);

module.exports = router;
