import api from "../../utils/api";
import {
  FETCH_JOBS_REQUEST,
  FETCH_JOBS_SUCCESS,
  FETCH_JOBS_FAILURE,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_FAILURE,
  DELETE_JOB_SUCCESS,
  DELETE_JOB_FAILURE,
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

export const createJob = (jobData) => async (dispatch) => {
  try {
    await api.post("/jobs", jobData);
    // refetch all jobs so category is fully populated
    const { data } = await api.get("/jobs");
    dispatch({ type: FETCH_JOBS_SUCCESS, payload: data.data });
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to create job.";
    dispatch({ type: CREATE_JOB_FAILURE, payload: message });
    throw error;
  }
};

export const deleteJob = (id) => async (dispatch) => {
  try {
    await api.delete(`/jobs/${id}`);
    dispatch({ type: DELETE_JOB_SUCCESS, payload: id });
  } catch (error) {
    const message = error.response?.data?.message || "Failed to delete job.";
    dispatch({ type: DELETE_JOB_FAILURE, payload: message });
    throw error;
  }
};
