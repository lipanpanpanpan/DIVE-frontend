import {
  REQUEST_PROJECT,
  RECEIVE_PROJECT,
  CREATE_PROJECT,
  CREATED_PROJECT,
  REQUEST_PROJECTS,
  RECEIVE_PROJECTS,
  REQUEST_PRELOADED_PROJECTS,
  RECEIVE_PRELOADED_PROJECTS,
  WIPE_PROJECT_STATE
} from '../constants/ActionTypes';

import { fetch } from './api.js';

function requestProjectDispatcher(projectId) {
  return {
    type: REQUEST_PROJECT,
    projectId: projectId
  };
}

function receiveProjectDispatcher(json) {
  return {
    type: RECEIVE_PROJECT,
    projectProperties: json,
    receivedAt: Date.now()
  };
}

function requestPreloadedProjectsDispatcher() {
  return {
    type: REQUEST_PRELOADED_PROJECTS
  };
}

function receivePreloadedProjectsDispatcher(json) {
  return {
    type: RECEIVE_PRELOADED_PROJECTS,
    projects: json.projects,
    receivedAt: Date.now()
  };
}

function requestProjectsDispatcher() {
  return {
    type: REQUEST_PROJECTS
  };
}

function receiveProjectsDispatcher(json) {
  return {
    type: RECEIVE_PROJECTS,
    projects: json.projects,
    receivedAt: Date.now()
  };
}
function createProjectDispatcher() {
  return {
    type: CREATE_PROJECT,
  };
}

function createdProjectDispatcher(json) {
  return {
    type: CREATED_PROJECT,
    projectProperties: json,
    receivedAt: Date.now()
  };
}

export function wipeProjectState() {
  return {
    type: WIPE_PROJECT_STATE
  };
}

function shouldCreateProject(state) {
  const { project } = state;
  if (project.loaded && !(project.properties || project.isFetching)) {
    return true;
  }
  return false;
}

export function createProjectIfNeeded(user_id, title, description) {
  return (dispatch, getState) => {
    if (shouldCreateProject(getState())) {
      return dispatch(createProject(user_id, title, description));
    }
  }
}

export function createProject(user_id, title, description) {
  var formData = new FormData();
  formData.append('user_id', user_id);
  formData.append('title', title);
  formData.append('description', description);

  return dispatch => {
    dispatch(createProjectDispatcher());
    return fetch('/projects/v1/projects', {
      method: 'post',
      body: formData
    }).then(response => response.json())
      .then(json => dispatch(createdProjectDispatcher(json)));
  }
}

export function fetchPreloadedProjects() {
  return dispatch => {
    dispatch(requestPreloadedProjectsDispatcher());
    return fetch('/projects/v1/projects?preloaded=true')
      .then(response => response.json())
      .then(json => dispatch(receivePreloadedProjectsDispatcher(json)));
  };
}

export function fetchProjects() {
  return dispatch => {
    dispatch(requestProjectsDispatcher());
    return fetch('/projects/v1/projects')
      .then(response => response.json())
      .then(json => dispatch(receiveProjectsDispatcher(json)));
  };
}

function fetchProject(projectId) {
  return dispatch => {
    dispatch(requestProjectDispatcher(projectId));
    return fetch('/projects/v1/projects/' + projectId)
      .then(response => response.json())
      .then(json => dispatch(receiveProjectDispatcher(json)));
  };
}

function shouldFetchProject(state) {
  const project = state.project;
  if (project.properties.id || project.isFetching) {
    return false;
  }
  return true;
}

export function fetchProjectIfNeeded(projectId) {
  return (dispatch, getState) => {
    if (shouldFetchProject(getState())) {
      return dispatch(fetchProject(projectId));
    }
  }
}