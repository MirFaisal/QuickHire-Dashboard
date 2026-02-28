import {
  FETCH_JOBS_REQUEST,
  FETCH_JOBS_SUCCESS,
  FETCH_JOBS_FAILURE,
  CREATE_JOB_SUCCESS,
  DELETE_JOB_SUCCESS,
} from "../types";

const initialState = {
  jobs: [],
  loading: false,
  error: null,
};

const jobReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_JOBS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_JOBS_SUCCESS:
      return { ...state, loading: false, jobs: action.payload, error: null };

    case FETCH_JOBS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CREATE_JOB_SUCCESS:
      return { ...state, jobs: [action.payload, ...state.jobs] };

    case DELETE_JOB_SUCCESS:
      return {
        ...state,
        jobs: state.jobs.filter((job) => job._id !== action.payload),
      };

    default:
      return state;
  }
};

export default jobReducer;
