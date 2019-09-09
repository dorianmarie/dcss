import { LOG_IN, LOG_OUT } from '@client/actions/types';

const initialState = {
    isLoggedIn: false
};

export default function(state = initialState, action) {
    switch (action.type) {
        case LOG_IN: {
            const { isLoggedIn, username } = action.payload;

            return {
                ...state,
                username,
                isLoggedIn
            };
        }
        case LOG_OUT: {
            let { username, isLoggedIn } = action.payload;

            return {
                ...state,
                username,
                isLoggedIn
            };
        }
        default:
            return state;
    }
}
