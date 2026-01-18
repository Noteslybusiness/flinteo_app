import { Action, createSlice, Dispatch, ThunkAction } from "@reduxjs/toolkit";
import { UserOrgProfileState } from "../types/types";
import { organizationService } from "../../../network/repo/organization/OrganizationService";


const initialState: UserOrgProfileState = {
    userProfileLoading: null,
    userProfileSuccess: null,
    userProfileError: null,
}

const userProfileReducer = createSlice({
    name: "userOrgProfile",
    initialState,
    reducers: {
        userProfileLoading(state) {
            return {
                ...state,
                userProfileLoading: true,
                userProfileSuccess: null,
                userProfileError: null,
            }
        },
        userProfileSuccess(state, action) {
            return {
                ...state,
                userProfileLoading: false,
                userProfileSuccess: action.payload,
                userProfileError: null,
            }
        },
        userProfileError(state, action) {
            return {
                ...state,
                userProfileLoading: false,
                userProfileSuccess: null,
                userProfileError: action.payload,
            }
        },
        clearUserProfileData(state) {
            return {
                ...state,
                userProfileLoading: null,
                userProfileSuccess: null,
                userProfileError: null,
            }
        }
    }
})

export const { userProfileLoading, userProfileSuccess, userProfileError, clearUserProfileData } = userProfileReducer.actions;

export default userProfileReducer.reducer;

type ThunkResult<R> = ThunkAction<R, any, undefined, Action>;

export const getUserOrgProfileData = (config: any): ThunkResult<void> => {
    return async (dispatch: Dispatch) => {
        dispatch(userProfileLoading())
        organizationService.getOrgDetailsRepo(config)
            .then((response) => {
                if (response && (response?.status === 200 || response?.status === 201))
                    dispatch(userProfileSuccess(response?.data))
                else
                    dispatch(userProfileError(response?.data))
            })
            .catch((error) => {
                dispatch(userProfileError(error))
            })
    }
}