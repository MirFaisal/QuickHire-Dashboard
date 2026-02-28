import {
  FETCH_APPLICATIONS_REQUEST,
  FETCH_APPLICATIONS_SUCCESS,
  FETCH_APPLICATIONS_FAILURE,
  DELETE_APPLICATION_SUCCESS,
  RESTORE_APPLICATION_SUCCESS,
} from "../types";

const initialState = {
  applications: [],
  loading: false,
  error: null,
};

const applicationReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_APPLICATIONS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_APPLICATIONS_SUCCESS:
      return { ...state, loading: false, applications: action.payload, error: null };

    case FETCH_APPLICATIONS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case DELETE_APPLICATION_SUCCESS:
      return {
        ...state,
        applications: state.applications.filter((app) => app._id !== action.payload),
      };

    case RESTORE_APPLICATION_SUCCESS:
      return {
        ...state,
        applications: [action.payload, ...state.applications],
      };

    default:
      return state;
  }
};

export default applicationReducer;
