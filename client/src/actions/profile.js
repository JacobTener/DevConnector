import axios from 'axios';
import { setAlert } from './alert'

import {
    CLEAR_PROFILE,
    GET_PROFILE,
    GET_PROFILES,
    GET_REPOS,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    ACCOUNT_DELETED
} from './types';

export const getCurrentProfile = () => async dispatch => {
    try {
        const profile = await axios.get('/api/profile/me');

        dispatch({
            type: GET_PROFILE,
            payload: profile.data
        })
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status
            }
        })
    }
}

export const getProfiles = () => async dispatch => {
    dispatch({ type: CLEAR_PROFILE })
    try {
        const profiles = await axios.get('/api/profile');

        dispatch({
            type: GET_PROFILES,
            payload: profiles.data
        })
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status
            }
        })
    }
}

export const getProfileById = userId => async dispatch => {
    try {
    const profile = await axios.get(`/api/profile/user/${userId}`);

    dispatch({
        type: GET_PROFILE,
        payload: profile.data
    })
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status
            }
        })
    }
}

export const getGithubRepos = username => async dispatch => {
    try {
        const repo = await axios.get(`/api/profile/github/${username}`);

        dispatch({
            type: GET_REPOS,
            payload: repo.data
        })
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status
            }
        })
    }
}


export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.post('/api/profile', formData, config)

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
        dispatch(setAlert(edit ? 'Profile Updated': 'Profile Created', 'success'));

        if(!edit) {
            history.push('/dashboard');
        }

    } catch (error) {
        const errors = error.response.data.errors;
        if(errors){
            errors.forEach(err => dispatch(setAlert(err.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status
            }
        });
    }
};

export const addExperience = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.put('/api/profile/experience', formData, config)

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert('Experience Added'));

        history.push('/dashboard');

    } catch (error) {
        const errors = error.response.data.errors;
        if(errors){
            errors.forEach(err => dispatch(setAlert(err.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status
            }
        });
    }
}

export const addEducation = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.put('/api/profile/education', formData, config)

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert('Education Added', 'success'));

        history.push('/dashboard');

    } catch (error) {
        const errors = error.response.data.errors;
        if(errors){
            errors.forEach(err => dispatch(setAlert(err.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status
            }
        });
    }
}

export const deleteExperience = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/experience/${id}`);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Experience Removed', 'success'));

    } catch (error) {

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status
            }
        });
    }
}

export const deleteEducation = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/education/${id}`);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Education Removed', 'success'));

    } catch (error) {

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status
            }
        });
    }
}

export const deleteAccount = () => async dispatch => {
    if(window.confirm('Are you sure you want to delete this account? This cannot be undone')) {
        try {
            await axios.delete(`/api/profile`);
            dispatch({type: CLEAR_PROFILE})
            dispatch({type: ACCOUNT_DELETED})

            dispatch(setAlert('Your account has been permenantly deleted.'));
    
        } catch (error) {
    
            dispatch({
                type: PROFILE_ERROR,
                payload: {
                    msg: error.response.statusText,
                    status: error.response.status
                }
            });
        }
    }

            
}