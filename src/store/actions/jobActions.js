import api from "../../utils/api";
import {
  FETCH_JOBS_REQUEST,
  FETCH_JOBS_SUCCESS,
  FETCH_JOBS_FAILURE,
} from "../types";

export const fetchJobs = () => async (dispatch) => {
  dispatch({ type: FETCH_JOBS_REQUEST });

  try {
    const { data } = await api.get("/jobs");
    dispatch({ type: FETCH_JOBS_SUCCESS, payload: data.data });
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch jobs.";
    dispatch({ type: FETCH_JOBS_FAILURE, payload: message });
  }
};
