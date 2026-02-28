import api from "../../utils/api";
import { FETCH_APPLICATIONS_REQUEST, FETCH_APPLICATIONS_SUCCESS, FETCH_APPLICATIONS_FAILURE } from "../types";

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
