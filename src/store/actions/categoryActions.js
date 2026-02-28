import api from "../../utils/api";
import {
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAILURE,
  CREATE_CATEGORY_SUCCESS,
  CREATE_CATEGORY_FAILURE,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAILURE,
} from "../types";

export const fetchCategories = () => async (dispatch) => {
  dispatch({ type: FETCH_CATEGORIES_REQUEST });

  try {
    const { data } = await api.get("/categories");
    dispatch({ type: FETCH_CATEGORIES_SUCCESS, payload: data.data });
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch categories.";
    dispatch({ type: FETCH_CATEGORIES_FAILURE, payload: message });
  }
};

export const createCategory = (categoryData) => async (dispatch) => {
  try {
    const { data } = await api.post("/categories", categoryData);
    dispatch({ type: CREATE_CATEGORY_SUCCESS, payload: data.data });
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to create category.";
    dispatch({ type: CREATE_CATEGORY_FAILURE, payload: message });
    throw error;
  }
};

export const deleteCategory = (id) => async (dispatch) => {
  try {
    await api.delete(`/categories/${id}`);
    dispatch({ type: DELETE_CATEGORY_SUCCESS, payload: id });
  } catch (error) {
    const message = error.response?.data?.message || "Failed to delete category.";
    dispatch({ type: DELETE_CATEGORY_FAILURE, payload: message });
    throw error;
  }
};
