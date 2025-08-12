const BASE_URL = import.meta.env.VITE_BASE_URL

export const categories = {
    CATEGORIES_API: `${BASE_URL}/api/v1/course/tag_s`
}
export const LoGin = {
    LOGIN_API: `${BASE_URL}/api/v1/user/login`
}

export const send_otp = {
    SIGN_OTP_API: `${BASE_URL}/api/v1/user/signup/sendOTP`
}

export const verify_otp = {
    SIGN_OTP_VERIFY_API: `${BASE_URL}/api/v1/user/signup`
}
export const getEnrolledCourses = {
    ENROLLED_COURSES_API: `${BASE_URL}/api/v1/course/getenrolled_courses`
}
export const getCartCourses = {
    CART_COURSES_API: `${BASE_URL}/api/v1/course/getcart_courses`
}
export const getavgratingCourses = {
    CART_COURSES_AVG_RATING_API: `${BASE_URL}/api/v1/course/avg_rating`
}
export const getCourseByid = {
    COURSE_ID_API: `${BASE_URL}/api/v1/course/get_course/:id`
}
export const getFullCourseByid = {
    FULL_COURSE_ID_API: `${BASE_URL}/api/v1/course/get_full_course`
}
export const createCourse = {
    CREATE_COURSE_API: `${BASE_URL}/api/v1/course/create`
}
export const FetchMyCourses = {
    MY_COURSE_API: `${BASE_URL}/api/v1/course/getenrolled_courses`
}
export const createsection = {
    CREATE_SECTION_API: `${BASE_URL}/api/v1/course/section/create`
}
export const editsection = {
    EDIT_SECTION_API: `${BASE_URL}/api/v1/course/section/edit`,
    DELETE_SECTION_API: `${BASE_URL}/api/v1/course/section/delete`
}
export const createsubsection = {
    CREATE_SUBSECTION_API: `${BASE_URL}/api/v1/course/subsection/create`
}
export const editsubsection = {
    EDIT_SUBSECTION_API: `${BASE_URL}/api/v1/course/subsection/edit`,
    DELETE_SUBSECTION_API: `${BASE_URL}/api/v1/course/subsection/delete`
}
export const submitquery = {
    SUBMIT_QUERY_API: `${BASE_URL}/api/v1/user/contactus/submitform`
}
export const changestatus = {
    CHANGE_STATUS_API: `${BASE_URL}/api/v1/course/changestatus`
}
export const additonalProfileApi = {
    PROFILE_INFO_API: `${BASE_URL}/api/v1/user/details`
}
export const additonalProfileApiUpdate = {
    PROFILE_INFO_UPDATE_API: `${BASE_URL}/api/v1/user/details/edit`
}
export const updateUserImage = {
    UPDATE_API_USER_IMAGE: `${BASE_URL}/api/v1/user/details/edit/image`
}
export const removeUserImage = {
    REMOVE_API_USER_IMAGE: `${BASE_URL}/api/v1/user/details/remove/image`
}
export const changePassword = {
    CHANGE_PASSWORD_API: `${BASE_URL}/api/v1/user/changePassword`
}
export const getallcourses = {
    GET_ALL_COURSES_API: `${BASE_URL}/api/v1/course/getAllcourses`
}
export const getTagDes = {
    GET_TAG_API: `${BASE_URL}/api/v1/course/tag/details`
}
export const submitReview = {
    SUBMIT_REVIEW_API:`${BASE_URL}/api/v1/course/rating/create`
}
export const resetpass = {
    RESET_PASS_API:`${BASE_URL}/api/v1/user/resetPassword/sendotp`
}
export const resetpassentry = {
    RESET_PASS_ENTRY_API:`${BASE_URL}/api/v1/user/resetPassword`
}
export const capturePayment = {
    PAYMENT_API:`${BASE_URL}/api/v1/payment/capture`
}
export const verifySignapi = {
    VERIFY_PAY_API:`${BASE_URL}/api/v1/payment/verify-signature`
}
export const deleteAccount = {
    DELETE_ACCOUNT_API: `${BASE_URL}/api/v1/user/deleteAccount`,
    CANCEL_DELETE_ACCOUNT_API: `${BASE_URL}/api/v1/user/cancel/deleteAccount`
}
export const deleteEditCourse = {
    DELETE_COURSE_API: `${BASE_URL}/api/v1/course/delete/course`, 
    UPDATE_COURSE_API: `${BASE_URL}/api/v1/course/edit/course`//append courseid
}
export const invoiceApi = {
    PURCHASE_HISTORY_API: `${BASE_URL}/api/v1/invoice/purchase-history`,
    GET_INVOICE_API: `${BASE_URL}/api/v1/invoice/invoice` // append /:invoiceId
}

// Admin APIs
export const adminApi = {
    GET_ALL_USERS_API: `${BASE_URL}/api/v1/admin/users`,
    GET_ALL_STUDENTS_API: `${BASE_URL}/api/v1/admin/students`,
    GET_ALL_INSTRUCTORS_API: `${BASE_URL}/api/v1/admin/instructors`,
    GET_USER_DETAILS_API: `${BASE_URL}/api/v1/admin/user`, // append /:userId
    CREATE_TAG_API: `${BASE_URL}/api/v1/course/tag/create`
}