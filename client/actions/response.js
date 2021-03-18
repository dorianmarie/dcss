import Storage from '@utils/Storage';
import {
  GET_RESPONSE_SUCCESS,
  GET_RESPONSE_ERROR,
  GET_TRANSCRIPTION_OUTCOME_SUCCESS,
  GET_TRANSCRIPTION_OUTCOME_ERROR,
  SET_RESPONSES_SUCCESS,
  SET_RESPONSES_ERROR
} from './types';

export let getResponse = (id, responseId) => async dispatch => {
  try {
    const res = await (await fetch(
      `/api/runs/${id}/response/${responseId}`
    )).json();

    if (res.error) {
      throw res;
    }

    let { response } = res;

    if (!response) {
      response = { response: null };
    }
    dispatch({ type: GET_RESPONSE_SUCCESS, response });
    return response;
  } catch (error) {
    dispatch({ type: GET_RESPONSE_ERROR, error });
    return null;
  }
};

export let getTranscriptionOutcome = ({ id, responseId }) => async dispatch => {
  try {
    const res = await (await fetch(
      `/api/runs/${id}/response/${responseId}/transcript`
    )).json();

    if (res.error) {
      throw res;
    }
    const { outcome } = res;
    if (outcome) {
      dispatch({ type: GET_TRANSCRIPTION_OUTCOME_SUCCESS, outcome });
      return outcome;
    }
    return {
      response: null,
      transcript: null
    };
  } catch (error) {
    dispatch({ type: GET_TRANSCRIPTION_OUTCOME_ERROR, error });
    return null;
  }
};

export let setResponses = (id, submitted) => async dispatch => {
  const responses = [];
  const responsesById = {};
  try {
    for (let [responseId, body] of submitted) {
      const res = await (await fetch(`/api/runs/${id}/response/${responseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })).json();

      if (res.error) {
        throw res;
      }

      const { response } = res;

      responses.push(response);
      responsesById[responseId] = response;

      if (Storage.has(`run/${id}/${responseId}`)) {
        Storage.delete(`run/${id}/${responseId}`);
      }
    }
    dispatch({ type: SET_RESPONSES_SUCCESS, responses, responsesById });
    return responses;
  } catch (error) {
    dispatch({ type: SET_RESPONSES_ERROR, error });
    return null;
  }
};
