import { INIT_VID_AS_HOST } from '../actions';

const initialState = {
  myId: null
};


export default function (state = initialState, action) {
  switch(action.type) {
    case INIT_VID_AS_HOST:
      return {
        ...state,
        myId: action.payload
      }
      default:
        return state;
    }
}

