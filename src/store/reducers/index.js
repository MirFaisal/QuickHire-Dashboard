import { combineReducers } from "redux";
import authReducer from "./authReducer";
import jobReducer from "./jobReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  jobs: jobReducer,
});

export default rootReducer;
