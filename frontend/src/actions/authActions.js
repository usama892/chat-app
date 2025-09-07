import axios from 'axios';

export const loginUser = (formData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: 'LOGIN_REQUEST' });

    const res = await axios.post('http://localhost:5000/api/login', formData);

    const { token, user } = res.data;
console.log(user)
    localStorage.setItem('token', token);
    localStorage.setItem('myUserId', user._id); // ✅ Now storing actual user ID
    localStorage.setItem('username',user.username);
    dispatch({ type: 'LOGIN_SUCCESS', payload: token });
    navigate('/dashboard');
  } catch (err) {
    dispatch({ type: 'LOGIN_FAILURE', payload: err.response.data.message });
  }
};

export const registerUser = (formData, navigate) => async (dispatch) => {
  try {
    dispatch({ type: 'LOGIN_REQUEST' });

    const res = await axios.post('http://localhost:5000/api/register', formData);
    const token = res.data.token;

    localStorage.setItem('token', token);
    dispatch({ type: 'LOGIN_SUCCESS', payload: token });

    navigate('/dashboard');
  } catch (err) {
    dispatch({ type: 'LOGIN_FAILURE', payload: err.response.data.message });
  }
};


export const logoutUser = () => {
  localStorage.removeItem('token');
  return { type: 'LOGOUT' };
};
