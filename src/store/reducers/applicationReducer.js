import { FETCH_APPLICATIONS_REQUEST, FETCH_APPLICATIONS_SUCCESS, FETCH_APPLICATIONS_FAILURE } from "../types";

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

    default:
      return state;
  }
};

export default applicationReducer;
