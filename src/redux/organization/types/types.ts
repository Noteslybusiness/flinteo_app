

export interface UserOrgProfileState {
    userProfileLoading: boolean | null,
    userProfileSuccess: UserOrgProfileSuccess | null,
    userProfileError: UserOrgProfileError | null,
}

export interface UserOrgProfileSuccess {
    result: boolean,
    data: any,
    message: string | null
}

export interface UserOrgProfileError {
    result: boolean,
    data: any,
    message: string | null,
    errors: any
}