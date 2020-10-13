const uuid = require('uuid/v4');
const { asyncMiddleware } = require('../../util/api');
const { reqScenario } = require('./middleware');
const { getUserById } = require('../auth/db');
const {
  addSlide,
  deleteSlide,
  getScenarioSlides,
  setAllSlides,
  setSlide
} = require('./slides/db');
const db = require('./db');

async function getScenarioAsync(req, res) {
  res.send({ scenario: reqScenario(req) });
}

async function getScenarioLockAsync(req, res) {
  const scenario = db.getScenarioLock(req.params.scenario_id, req.params.lock);

  res.send({ scenario });
}

async function getAllScenariosAsync(req, res) {
  try {
    const scenarios = await db.getAllScenarios();
    res.send({ scenarios });
  } catch (apiError) {
    const error = new Error('Error while getting all scenarios.');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function addScenarioAsync(req, res) {
  const { author, title, description, categories } = req.body;
  let authorId = req.session.user.id;
  let message = '';

  if (!authorId) {
    message = 'Permission denied for this user.';
  }

  if (!message && !title) {
    message = 'A title must be provided to create a new scenario.';
  }

  if (message) {
    const error = new Error(message);
    error.status = 409;
    throw error;
  }

  if (author && author.id) {
    authorId = author.id;
  }

  try {
    const scenario = await db.addScenario(authorId, title, description);
    await db.setScenarioCategories(scenario.id, categories);
    res.status(201).json({ scenario });
  } catch (apiError) {
    const error = new Error('Error while creating scenario.');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function setScenarioAsync(req, res) {
  const {
    author,
    author_id: user_id,
    deleted_at,
    description,
    categories,
    consent,
    finish,
    status,
    title
  } = req.body;
  const scenario_id = Number(req.params.scenario_id);
  let author_id = user_id;

  if (author && author.id) {
    author_id = author.id || user_id;
  }

  // if (!author_id && !title) {
  //   const error = new Error(
  //     'Must provide author, author_id, title, or description to update.'
  //   );
  //   error.status = 409;
  //   throw error;
  // }

  try {
    const scenario = await db.setScenario(scenario_id, {
      author_id,
      deleted_at,
      description,
      status,
      title
    });

    await db.setScenarioCategories(scenario_id, categories);

    // If the client set the id to null, that indicates that
    // this is a new consent agreement and the new prose
    // must be stored, then linked to the scenario.
    if (!consent.id) {
      const { id, prose } = await db.addScenarioConsent(consent);

      await db.setScenarioConsent(
        scenario_id,
        Object.assign(consent, { id, prose })
      );
    }

    if (!finish.id) {
      const { components, id, is_finish } = await addSlide({
        scenario_id,
        components:
          finish.components ||
          '[{"html": "<h2>Thanks for participating!</h2>","type": "Text"}]',
        is_finish: true,
        title: finish.title || ''
      });

      Object.assign(finish, {
        components,
        id,
        is_finish
      });
    } else {
      await setSlide(finish.id, finish);
    }

    Object.assign(scenario, {
      categories,
      consent,
      finish
    });

    res.status(200).send({ scenario });
  } catch (apiError) {
    const error = new Error('Error while updating scenario');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function deleteScenarioAsync(req, res) {
  const scenario_id = Number(req.params.scenario_id);

  if (!scenario_id) {
    const error = new Error('Scenario id required for scenario deletion');
    error.status = 409;
    throw error;
  }

  try {
    const scenario = await db.deleteScenario(scenario_id);
    res.send({ scenario });
  } catch (apiError) {
    const error = new Error('Error while deleting scenario');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function addScenarioLockAsync(req, res) {
  const scenario_id = Number(req.params.scenario_id);
  const user_id = Number(req.session.user.id);
  try {
    let lock = await db.getScenarioLock(scenario_id);
    if (!lock) {
      await db.addScenarioLock(scenario_id, user_id);
    }
    const scenario = await db.getScenario(scenario_id);
    res.send({ scenario });
  } catch (apiError) {
    const error = new Error('Error while unlocking scenario');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function endScenarioLockAsync(req, res) {
  const scenario_id = Number(req.params.scenario_id);
  const user_id = Number(req.session.user.id);
  try {
    const unlock = await db.endScenarioLock(scenario_id, user_id);
    if (unlock) {
      const scenario = await db.getScenario(scenario_id);
      res.send({ scenario });

      const slides = await getScenarioSlides(scenario_id);
      await db.addScenarioSnapshot(scenario_id, user_id, {
        ...scenario,
        slides
      });
    } else {
      throw new Error('Could not unlock scenario');
    }
  } catch (apiError) {
    const error = new Error('Error while unlocking scenario');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function softDeleteScenarioAsync(req, res) {
  const scenarioId = req.params.scenario_id;

  if (!scenarioId) {
    const error = new Error('Scenario id required for scenario deletion');
    error.status = 409;
    throw error;
  }

  try {
    const scenario = await db.softDeleteScenario(scenarioId);

    res.send({ scenario });
  } catch (apiError) {
    const error = new Error('Error while soft deleting scenario');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function copyScenarioAsync(req, res) {
  const scenarioId = req.params.scenario_id;

  if (!scenarioId) {
    const error = new Error(
      'Original scenario id required for creating a copy'
    );
    error.status = 409;
    throw error;
  }

  try {
    const userId = req.session.user.id;
    const { title, description, categories } = reqScenario(req);
    const scenario = await db.addScenario(userId, `${title} COPY`, description);
    const sourceSlides = await getScenarioSlides(scenarioId);

    const slides = sourceSlides.filter(({ is_finish }) => !is_finish);
    const sourceFinishSlide = sourceSlides.find(({ is_finish }) => is_finish);

    await deleteSlide(scenario.id, scenario.finish.id);

    const finish = await addSlide({
      scenario_id: scenario.id,
      title: sourceFinishSlide.title,
      components: sourceFinishSlide.components,
      is_finish: true
    });

    // When copying a scenario, not only do new responseIds need to be set,
    // but any recallIds that refer to old responseIds must be mapped to
    // the copy's responseId
    const slidesNeedRecallIdUpdate = [];
    const responseIdMap = {};

    // 1. Find all response components and assign each one a new responseId,
    //    while saving a mapping of "old response id" => "new response id"
    //    to be used in remapping the recallIds.
    for (const slide of slides) {
      for (const component of slide.components) {
        // When a response component has been
        // found, assign it a newly generated responseId,
        // to prevent duplicate responseId values from
        // being created.
        //
        // This check used to use:
        //
        // Object.prototype.hasOwnProperty.call(component, 'responseId')
        //
        // But no longer needs to, since responseId cannot be empty.
        //
        if (component.responseId) {
          // Save the original responseId, so we can use
          // it for mapping to recallId in a second pass.
          responseIdMap[component.responseId] = uuid();
          component.responseId = responseIdMap[component.responseId];

          // If we encounter a MultiPathPrompt component, we need to check
          // if it has a path to the old scenario's FINISH slide. If yes,
          // then we need to replace that id with our new finish slide id.
          if (component.paths) {
            component.paths.forEach((path, index) => {
              if (String(path.value) === String(sourceFinishSlide.id)) {
                component.paths[index].value = finish.id;
              }
            });
          }
        }

        // If any slide uses a ResponseRecall component, add the slide
        // to an update list.
        if (component.recallId && !slidesNeedRecallIdUpdate.includes(slide)) {
          slidesNeedRecallIdUpdate.push(slide);
        }

        // Make sure that all components have a new id
        component.id = uuid();
      }
    }

    // 2. If any slide has been flagged for recallId remapping, update them.
    for (const slide of slidesNeedRecallIdUpdate) {
      for (const component of slide.components) {
        component.recallId = responseIdMap[component.recallId];
      }
    }

    await setAllSlides(scenario.id, [...slides]);

    await db.setScenarioCategories(scenario.id, categories);

    const consent = await db.getScenarioConsent(scenarioId);
    const { id, prose } = await db.addScenarioConsent(consent);

    await db.setScenarioConsent(
      scenario.id,
      Object.assign(consent, { id, prose })
    );

    Object.assign(scenario, {
      consent,
      categories,
      finish
    });
    res.send({ scenario, status: 201 });
  } catch (apiError) {
    const error = new Error('Error while copying scenario');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function getScenarioByRunAsync(req, res) {
  const userId = req.session.user.id;
  const scenarios = await db.getScenarioByRun(userId);
  res.send({ scenarios });
}

async function addScenarioUserRoleAsync(req, res) {
  const { scenario_id, user_id, roles } = req.body;
  const user = await getUserById(user_id);
  if (!user.id || !roles.length) {
    const error = new Error('User and roles must be defined');
    error.status = 409;
    throw error;
  }

  try {
    const result = await db.addScenarioUserRole(scenario_id, user_id, roles);
    const scenario = await db.getScenario(scenario_id);
    res.json({
      scenario,
      ...result
    });
  } catch (apiError) {
    const error = new Error('Error while adding roles');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

async function endScenarioUserRoleAsync(req, res) {
  const { scenario_id, user_id, roles } = req.body;
  const user = await getUserById(user_id);
  if (!user.id || !roles.length) {
    const error = new Error('User and roles must be defined');
    error.status = 409;
    throw error;
  }

  try {
    const result = await db.endScenarioUserRole(scenario_id, user_id, roles);
    const scenario = await db.getScenario(scenario_id);
    res.json({
      scenario,
      ...result
    });
  } catch (apiError) {
    const error = new Error('Error while deleting roles');
    error.status = 500;
    error.stack = apiError.stack;
    throw error;
  }
}

exports.getScenario = asyncMiddleware(getScenarioAsync);
exports.getScenarioLock = asyncMiddleware(getScenarioLockAsync);
exports.addScenarioLock = asyncMiddleware(addScenarioLockAsync);
exports.endScenarioLock = asyncMiddleware(endScenarioLockAsync);
exports.getAllScenarios = asyncMiddleware(getAllScenariosAsync);
exports.addScenario = asyncMiddleware(addScenarioAsync);
exports.setScenario = asyncMiddleware(setScenarioAsync);
exports.deleteScenario = asyncMiddleware(deleteScenarioAsync);
exports.softDeleteScenario = asyncMiddleware(softDeleteScenarioAsync);
exports.copyScenario = asyncMiddleware(copyScenarioAsync);
exports.getScenarioByRun = asyncMiddleware(getScenarioByRunAsync);
exports.addScenarioUserRole = asyncMiddleware(addScenarioUserRoleAsync);
exports.endScenarioUserRole = asyncMiddleware(endScenarioUserRoleAsync);
