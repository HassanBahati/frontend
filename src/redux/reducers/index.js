import { combineReducers } from 'redux';
import ClustersReducer from './clustersReducer';
import addCluster from './addCluster';
import user from './user';
import ClusterResourcesReducer from './ClusterResourcesReducer';
import ServicesReducer from './servicesReducer';
import PvsReducer from './PvsReducer';
import nodesReducer from './nodesReducer';
import PvcsReducer from './pvcsReducer';
import NamespacesListReducer from './NamespacesListReducer';
import podsReducer from './podsReducer';
import storageClassesReducer from './storageClassReducer';
import JobsReducer from './jobsReducer';
import getDeployments from './getDeployments';
import AdminProjectsReducer from './AdminProjectsReducer';
import AppsListReducer from './appsListReducer';
import UserProjectsReducer from './userProjectsReducer';
import addProjectReducer from './addProjectReducer';
import createAppReducer from './createApp';
import deleteAppReducer from './DeleteAppReducer';
import UserDetailReducer from './userDetailReducer';
import UsersListReducer from './usersListReducer';


export default combineReducers({
  ClusterResourcesReducer,
  ClustersReducer,
  user,
  addCluster,
  ServicesReducer,
  storageClassesReducer,
  PvsReducer,
  nodesReducer,
  PvcsReducer,
  NamespacesListReducer,
  podsReducer,
  deployments: getDeployments,
  JobsReducer,
  AdminProjectsReducer,
  AppsListReducer,
  UserProjectsReducer,
  addProjectReducer,
  createNewApp: createAppReducer,
  deleteAppReducer,
  UserDetailReducer,
  UsersListReducer,
});
