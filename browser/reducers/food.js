import { reducerMode } from '../game/main';
let newState;

/*----------  INITIAL STATE  ----------*/
const initialState = {};

/*----------  ACTION TYPES  ----------*/
const RECEIVE_FOOD = 'RECEIVE_FOOD';
const RECEIVE_MULTIPLE_FOOD = 'RECEIVE_MULTIPLE_FOOD';
const REMOVE_FOOD = 'REMOVE_FOOD';


/*----------  ACTION CREATORS  ----------*/
module.exports.receiveFood = (id, data, room) => ({
  type: RECEIVE_FOOD,
  id,
  data,
  room
});

module.exports.receiveMultipleFood = (food, room) => ({
  type: RECEIVE_MULTIPLE_FOOD,
  food,
  room
});

module.exports.removeFood = (id, room) => ({
  type: REMOVE_FOOD,
  id,
  room
});


/*----------  THUNK CREATORS  ----------*/

/*----------  REDUCER  ----------*/
const immutable = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_FOOD:
      newState = Object.assign({}, state);
      newState[action.room] = Object.assign({}, newState[action.room]);
      newState[action.room][action.id] = action.data;
      return newState;
    case RECEIVE_MULTIPLE_FOOD:
      newState = Object.assign({}, state);
      newState[action.room] = Object.assign({}, newState[action.room], action.food);
      return newState;
    case REMOVE_FOOD:
      newState = Object.assign({}, state);
      newState[action.room] = Object.assign({}, newState[action.room]);
      delete newState[action.room][action.id];
      return newState;
    default: return state;
  }
};


const semimutable = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_FOOD:
      newState = Object.assign({}, state);
      newState[action.room][action.id] = action.data;
      return newState;
    case RECEIVE_MULTIPLE_FOOD:
      newState = Object.assign({}, state);
      Object.assign(newState[action.room], action.food);
      return newState;
    case REMOVE_FOOD:
      newState = Object.assign({}, state);
      delete newState[action.room][action.id];
      return newState;
    default: return state;
  }
};


const mutable = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_FOOD:
      state[action.room][action.id] = action.data;
      return state;
    case RECEIVE_MULTIPLE_FOOD:
      Object.assign(state[action.room], action.food);
      return state;
    case REMOVE_FOOD:
      delete state[action.room][action.id];
      return state;
    default: return state;
  }
};


const chooseReducer = reducerMode => {
  switch (reducerMode) {
    case 'mutable': return mutable;
    case 'semimutable': return semimutable;
    case 'immutable': return immutable;
    default: return mutable;
  }
};

export default chooseReducer('immutable');