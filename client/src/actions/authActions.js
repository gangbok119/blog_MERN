import axios from 'axios';
import {GET_ERRORS, SET_CURRENT_USER} from './types';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';

// Register user
export const registerUser = (userData,history) => dispatch => {
    axios
        .post('/users/register', userData)
        .then(res => history.push('/login'))
        .catch(err => dispatch({
            type:GET_ERRORS,
            payload: err.response.data
        }));



};

// login - get user token
export const loginUser = userData => dispatch => {
    axios
        .post('/users/login', userData)
        .then(res => {
            // save to localstorage
            const { token } = res.data;

            // set token to ls
            localStorage.setItem('jwtToken', token);

            // set token to auth headers
            setAuthToken(token);

            // decode token to get user data
            const decoded = jwt_decode(token);

            // set current user
            dispatch(setCurrentUser(decoded));
        })
        .catch(err => dispatch({
            type:GET_ERRORS,
            payload: err.response.data
        }));
};

// set logged in user
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};