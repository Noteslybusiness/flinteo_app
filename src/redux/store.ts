import { combineReducers, configureStore } from "@reduxjs/toolkit";
import UserProfileReducer from "./organization/reducers/userProfileReducer";

export const CLEAR_STATE = "CLEAR_STATE";

const dummyReducer = (state = {}, action: any) => state;

const appReducer = combineReducers({
    dummy: dummyReducer,
    userProfileReducer: UserProfileReducer
});

const rootReducer = (state: any, action: any) => {
    if (action.type === CLEAR_STATE) {
        state = undefined;
    }
    return appReducer(state, action);
};

const store = configureStore({
    reducer: rootReducer,
});

export const clearState = () => ({ type: CLEAR_STATE });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
