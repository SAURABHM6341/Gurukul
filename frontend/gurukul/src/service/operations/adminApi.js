import { apiConnector } from '../apiconnector';
import { adminApi } from '../apis';
import { toast } from "react-hot-toast";

const { 
    GET_ALL_USERS_API, 
    GET_ALL_STUDENTS_API, 
    GET_ALL_INSTRUCTORS_API, 
    GET_USER_DETAILS_API,
    CREATE_TAG_API 
} = adminApi;

// Get all users
export const getAllUsers = async (token) => {
    toast.dismiss();
    const toastId = toast.loading("Loading users...");
    let result = [];
    try {
        const response = await apiConnector("GET", GET_ALL_USERS_API, null, {
            Authorization: `Bearer ${token}`,
        });

        if (!response?.data?.success) {
            throw new Error("Could not fetch users");
        }

        result = response?.data?.data;
        toast.dismiss();
        toast.dismiss(toastId);
        toast.success("Users loaded successfully");
    } catch (error) {
        console.log("GET_ALL_USERS_API ERROR............", error);
        toast.dismiss();
        toast.dismiss(toastId);
        toast.error(error?.response?.data?.message || "Could not fetch users");
    }
    return result;
};

// Get all students
export const getAllStudents = async (token) => {
    toast.dismiss();
    const toastId = toast.loading("Loading students...");
    let result = [];
    try {
        const response = await apiConnector("GET", GET_ALL_STUDENTS_API, null, {
            Authorization: `Bearer ${token}`,
        });

        if (!response?.data?.success) {
            throw new Error("Could not fetch students");
        }

        result = response?.data?.data;
        toast.dismiss();
        toast.dismiss(toastId);
        toast.success("Students loaded successfully");
    } catch (error) {
        console.log("GET_ALL_STUDENTS_API ERROR............", error);
        toast.dismiss();
        toast.dismiss(toastId);
        toast.error(error?.response?.data?.message || "Could not fetch students");
    }
    return result;
};

// Get all instructors
export const getAllInstructors = async (token) => {
    toast.dismiss();
    const toastId = toast.loading("Loading instructors...");
    let result = [];
    try {
        console.log("Calling GET_ALL_INSTRUCTORS_API:", GET_ALL_INSTRUCTORS_API);
        const response = await apiConnector("GET", GET_ALL_INSTRUCTORS_API, null, {
            Authorization: `Bearer ${token}`,
        });

        console.log("Instructors API response:", response);

        if (!response?.data?.success) {
            throw new Error("Could not fetch instructors");
        }

        result = response?.data?.data;
        console.log("Instructors result:", result);
        toast.dismiss();
        toast.dismiss(toastId);
        toast.success("Instructors loaded successfully");
    } catch (error) {
        console.log("GET_ALL_INSTRUCTORS_API ERROR............", error);
        toast.dismiss();
        toast.dismiss(toastId);
        toast.error(error?.response?.data?.message || "Could not fetch instructors");
    }
    return result;
};

// Get user details by ID
export const getUserDetails = async (userId, token) => {
    toast.dismiss();
    const toastId = toast.loading("Loading user details...");
    let result = null;
    try {
        const response = await apiConnector("GET", `${GET_USER_DETAILS_API}/${userId}`, null, {
            Authorization: `Bearer ${token}`,
        });

        if (!response?.data?.success) {
            throw new Error("Could not fetch user details");
        }

        result = response?.data?.data;
        toast.dismiss();
        toast.dismiss(toastId);
        toast.success("User details loaded successfully");
    } catch (error) {
        console.log("GET_USER_DETAILS_API ERROR............", error);
        toast.dismiss();
        toast.dismiss(toastId);
        toast.error(error?.response?.data?.message || "Could not fetch user details");
    }
    return result;
};

// Create new tag (for admin)
export const createTag = async (data, token) => {
    toast.dismiss();
    const toastId = toast.loading("Creating tag...");
    let result = null;
    try {
        console.log("Creating tag with data:", data);
        console.log("Using API endpoint:", CREATE_TAG_API);
        
        const response = await apiConnector("POST", CREATE_TAG_API, {
            Authorization: `Bearer ${token}`,
        }, data);

        console.log("Tag creation response:", response);

        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Could not create tag");
        }

        result = response?.data?.data;
        toast.dismiss();
        toast.dismiss(toastId);
        toast.success("Tag created successfully");
    } catch (error) {
        console.log("CREATE_TAG_API ERROR............", error);
        toast.dismiss();
        toast.dismiss(toastId);
        toast.error(error?.response?.data?.message || "Could not create tag");
    }
    return result;
};
