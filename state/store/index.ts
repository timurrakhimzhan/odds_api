import {createStore, Store} from 'redux';
import reducers from './../reducers';

const store: Store = createStore(reducers);
export default store;