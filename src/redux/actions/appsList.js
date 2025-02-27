import axios from "../../axios";
import {
  GET_APPS_SUCCESS,
  GET_APPS_FAIL,
  START_GETTING_APPS,
} from "./actionTypes";

export const startFetchingApps = () => ({
  type: START_GETTING_APPS,
});

export const getAppsSuccess = (response) => ({
  type: GET_APPS_SUCCESS,
  payload: response.data.data,
});

export const getAppsFail = (error) => ({
  type: GET_APPS_FAIL,
  payload: {
    status: false,
    error: error,
  },
});

const getAppsList = (projectID) => (dispatch) => {
  dispatch(startFetchingApps());
  return axios
    .get(`/projects/${projectID}/apps`)
    .then((response) => {   
      dispatch(getAppsSuccess(response))     
    })
    .catch((error) => {
      // accept status codes 200 and  409,
      //409 returns defected apps whose urls have to be regenerated by
      if(error.response.status === 409){
        dispatch(getAppsSuccess(error.response)) 
      }else{
        dispatch(getAppsFail(error));
      }
    });
};

export default getAppsList;
