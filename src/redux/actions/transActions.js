// redux/actions/transActions.js
export const updateTrans = (trans) => {
    return {
      type: 'UPDATE_TRANS',
      payload: trans,
    };
  };
  