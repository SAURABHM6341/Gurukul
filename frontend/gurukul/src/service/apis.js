const BASE_URL = import.meta.env.VITE_BASE_URL

export const categories={
    CATEGORIES_API:`${BASE_URL}/api/v1/course/tag_s`
}
export const LoGin = {
    LOGIN_API:`${BASE_URL}/api/v1/user/login`
}

export const send_otp = {
    SIGN_OTP_API:`${BASE_URL}/api/v1/user/signup/sendOTP`
}

export const verify_otp = {
    SIGN_OTP_VERIFY_API:`${BASE_URL}/api/v1/user/signup`
}
export const getEnrolledCourses = {
    ENROLLED_COURSES_API:`${BASE_URL}/api/v1/course/getenrolled_courses`
}
export const getCartCourses = {
    CART_COURSES_API:`${BASE_URL}/api/v1/course/getcart_courses`
}
export const getavgratingCourses = {
    CART_COURSES_AVG_RATING_API:`${BASE_URL}/api/v1/course/avg_rating`
}
export const getCourseByid = {
    COURSE_ID_API:`${BASE_URL}/api/v1/course/get_course/:id`
}
export const createCourse = {
    CREATE_COURSE_API:`${BASE_URL}/api/v1/course/create`
}
export const FetchMyCourses = {
    MY_COURSE_API:`${BASE_URL}/api/v1/course/getenrolled_courses`
}
export const createsection = {
    CREATE_SECTION_API:`${BASE_URL}/api/v1/course/section/create`
}
export const editsection = {
    EDIT_SECTION_API:`${BASE_URL}/api/v1/course/section/edit`
}
export const createsubsection = {
    CREATE_SUBSECTION_API:`${BASE_URL}/api/v1/course/subsection/create`
}
export const editsubsection = {
    EDIT_SUBSECTION_API:`${BASE_URL}/api/v1/course/subsection/edit`
}
export const submitquery = {
    SUBMIT_QUERY_API:`${BASE_URL}/api/v1/user/contactus/submitform`
}
export const changestatus = {
    CHANGE_STATUS_API:`${BASE_URL}/api/v1/course/changestatus`
}
export const additonalProfileApi = {
    PROFILE_INFO_API:`${BASE_URL}/api/v1/user/details`
}
export const additonalProfileApiUpdate = {
    PROFILE_INFO_UPDATE_API:`${BASE_URL}/api/v1/user/details/edit`
}
export const updateUserImage = {
    UPDATE_API_USER_IMAGE:`${BASE_URL}/api/v1/user/details/edit/image`
}
export const changePassword = {
    CHANGE_PASSWORD_API:`${BASE_URL}/api/v1/user/changePassword`
}