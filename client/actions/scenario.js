import {
  // GET_SCENARIO,
  GET_SCENARIO_SUCCESS,
  GET_SCENARIO_ERROR,
  // GET_SCENARIOS,
  GET_SCENARIOS_SUCCESS,
  GET_SCENARIOS_ERROR,
  // GET_SCENARIO_RUN_HISTORY,
  GET_SCENARIO_RUN_HISTORY_SUCCESS,
  GET_SCENARIO_RUN_HISTORY_ERROR,
  // GET_SLIDES,
  GET_SLIDES_SUCCESS,
  GET_SLIDES_ERROR,
  SET_SCENARIO,
  // SET_SCENARIO_SUCCESS,
  // SET_SCENARIO_ERROR,
  SET_SCENARIOS,
  // SET_SCENARIOS_SUCCESS,
  // SET_SCENARIOS_ERROR,
  SET_SLIDES
} from './types';

export const getScenarios = () => async dispatch => {
  try {
    const res = await (await fetch('/api/scenarios')).json();
    if (res.error) {
      throw error;
    }
    const {
      scenarios
    } = res;

    dispatch({ type: GET_SCENARIOS_SUCCESS, scenarios });
    return scenarios;
  } catch (error) {
    dispatch({ type: GET_SCENARIOS_ERROR, error });
    return null;
  }
};

export const getScenario = id => async dispatch => {
  try {
    const res = await (await fetch(
      `/api/scenarios/${id}`
    )).json();

    if (res.error) {
      throw res;
    }
    const {
      scenario
    } = res;
    dispatch({ type: GET_SCENARIO_SUCCESS, scenario });
    return scenario;
  } catch (error) {
    dispatch({ type: GET_SCENARIO_ERROR, error });
    return null;
  }
};

export const getScenarioRunHistory = params => async dispatch => {
  const { scenarioId, cohortId } = params;
  try {
    const endpoint = cohortId
      ? `/api/scenarios/${scenarioId}/cohort/${cohortId}/history`
      : `/api/scenarios/${scenarioId}/history`;

    const res = await (await fetch(endpoint)).json();

    if (res.error) {
      throw error;
    }

    const {
      history
    } = res;

    dispatch({ type: GET_SCENARIO_RUN_HISTORY_SUCCESS, ...history });
    return { ...history };
  } catch (error) {
    dispatch({ type: GET_SCENARIO_RUN_HISTORY_ERROR, error });
    return null;
  }
};

export const getSlides = id => async dispatch => {
  try {
    const res = await (await fetch(
      `/api/scenarios/${id}/slides`
    )).json();

    if (res.error) {
      throw error;
    }

    const {
      slides
    } = res;

    dispatch({ type: GET_SLIDES_SUCCESS, slides });
    return slides;
  } catch (error) {
    dispatch({ type: GET_SLIDES_ERROR, error });
    return null;
  }
};

export const setScenario = scenario => {
  if (scenario === null) {
    return {
      type: SET_SCENARIO,
      scenario: {
        author: {},
        title: '',
        description: '',
        finish: {
          components: [
            {
              html: `<h2>Thanks for participating!</h2>`
            }
          ],
          is_finish: true,
          title: ''
        },
        categories: [],
        status: 1
      }
    };
  }

  return {
    type: SET_SCENARIO,
    scenario
  };
};

export const setScenarios = scenarios => ({
  type: SET_SCENARIOS,
  scenarios
});

export const setSlides = slides => ({
  type: SET_SLIDES,
  slides
});
