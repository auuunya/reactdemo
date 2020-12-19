import { createStore } from 'redux';
import { addTodo, setVisibilityFilter, toggleTodo, VisibilityFilters } from './actions';
import todoApp from './reducers';

let store = createStore(todoApp, window.STATE_FROM_SERVER)

console.log("start:",store.getState())

let unsubscribe = store.subscribe(() => 
    console.log("111", store.getState())
)

store.dispatch(addTodo("Learn about actions"));
store.dispatch(addTodo("Learn about reducers"));
store.dispatch(addTodo("Learn about store"));
store.dispatch(toggleTodo(0));
store.dispatch(toggleTodo(1));
store.dispatch(setVisibilityFilter(VisibilityFilters.SHOW_COMPLETED));

unsubscribe();
export default store;