// redux/reducers/transReducer.js
const initialState = {
    trans: [],
  };
  
  const transReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPDATE_TRANS':
        return {
          ...state,
          trans: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default transReducer;

