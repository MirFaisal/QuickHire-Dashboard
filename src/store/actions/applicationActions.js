import api from "../../utils/api";
import {
  FETCH_APPLICATIONS_REQUEST,
  FETCH_APPLICATIONS_SUCCESS,
  FETCH_APPLICATIONS_FAILURE,
  DELETE_APPLICATION_SUCCESS,
  DELETE_APPLICATION_FAILURE,
  RESTORE_APPLICATION_SUCCESS,
  RESTORE_APPLICATION_FAILURE,
} from "../types";

export const fetchApplications = () => async (dispatch) => {
  dispatch({ type: FETCH_APPLICATIONS_REQUEST });

  try {
    const { data } = await api.get("/applications");
    dispatch({ type: FETCH_APPLICATIONS_SUCCESS, payload: data.data });
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch applications.";
    dispatch({ type: FETCH_APPLICATIONS_FAILURE, payload: message });
  }
};

export const deleteApplication = (id) => async (dispatch) => {
  try {
    await api.delete(`/applications/${id}`);
    dispatch({ type: DELETE_APPLICATION_SUCCESS, payload: id });
  } catch (error) {
    const message = error.response?.data?.message || "Failed to delete application.";
    dispatch({ type: DELETE_APPLICATION_FAILURE, payload: message });
    throw error;
  }
};

export const restoreApplication = (id) => async (dispatch) => {
  try {
    const { data } = await api.patch(`/applications/restore/${id}`);
    dispatch({ type: RESTORE_APPLICATION_SUCCESS, payload: data.data });
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to restore application.";
    dispatch({ type: RESTORE_APPLICATION_FAILURE, payload: message });
    throw error;
  }
};
