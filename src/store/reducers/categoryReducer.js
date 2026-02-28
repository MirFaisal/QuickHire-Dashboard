import {
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAILURE,
  CREATE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_SUCCESS,
} from "../types";

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CATEGORIES_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_CATEGORIES_SUCCESS:
      return { ...state, loading: false, categories: action.payload, error: null };

    case FETCH_CATEGORIES_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CREATE_CATEGORY_SUCCESS:
      return { ...state, categories: [...state.categories, action.payload] };

    case DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: state.categories.filter((cat) => cat._id !== action.payload),
      };

    default:
      return state;
  }
};

export default categoryReducer;
