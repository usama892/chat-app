const initialState = {
  token: localStorage.getItem('token'),
  user: null,
  loading: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return { ...state, loading: true };
    case 'LOGIN_SUCCESS':
      return { ...state, token: action.payload, loading: false };
    case 'LOGIN_FAILURE':
      return { ...state, error: action.payload, loading: false };
    case 'LOGOUT':
      return { ...state, token: null, user: null };
    default:
      return state;
  }
};

export default authReducer;
