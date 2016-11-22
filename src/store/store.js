import { createStore } from 'redux'
import RootReducer from './../reducers/root_reducer';
import masterMiddleWare from './../middleware/master_middleware';

const configureStore = () => (
  createStore(
    RootReducer,
    masterMiddleWare
  )
);

export default configureStore;
