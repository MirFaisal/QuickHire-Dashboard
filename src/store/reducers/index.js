import { combineReducers } from "redux";
import authReducer from "./authReducer";
import jobReducer from "./jobReducer";
import categoryReducer from "./categoryReducer";
import applicationReducer from "./applicationReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  jobs: jobReducer,
  categories: categoryReducer,
  applications: applicationReducer,
});

export default rootReducer;
