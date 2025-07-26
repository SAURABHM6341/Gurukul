const express = require('express');
const router = express.Router();
const {createCourse, getAllCourses, getCourseDetailsById} = require('../Controllers/Course_s');
const {authenticate, isInstructor, isStudent, isAdmin} = require('../Middlewares/auth');

// ************ courses *************

router.post('/create', authenticate, isInstructor, createCourse);
router.get('/getAllcourses', getAllCourses);
router.get('/get/:id', getCourseDetailsById);

// *********** for rating and review ***********

const {createRating, getAvgRating, getAllRatings, getAllRatingsAndReviews, deleteRating} = require('../Controllers/ratingandReview');

router.post('/rating/create', authenticate, isStudent, createRating);
router.get('/avg_rating', getAvgRating);
// get all ratings for a course
router.get('/ratings', getAllRatings);
//get all rating and review of all user and all course
router.get('/ratings_and_reviews', getAllRatingsAndReviews);
// delete rating
router.delete('/student_rating/delete', authenticate, isStudent, deleteRating);
router.delete('/admin_rating/delete', authenticate, isAdmin, deleteRating);

// *********** sections and subsections ***********
const {createSection, editSection, deleteSection, getAllSections} = require('../Controllers/sections');
// create section or chapters
router.post('/section/create', authenticate, isInstructor, createSection);
// edit sections or chapters
router.put('/section/edit', authenticate, isInstructor, editSection);
// delete section or chapters from course
router.delete('/section/delete/:courseId', authenticate, isInstructor, deleteSection);
router.delete('/admin/section/delete/:courseId', authenticate, isAdmin, deleteSection); // for admin to delete section
// get all sections of a course
router.get('/sections/:courseId', authenticate, getAllSections);

// *********** sub sections ***********

const {deleteSubSection, editSubSection, createSubSection, getAllSubSections} = require('../Controllers/subSection');
// create sub section
router.post('/subsection/create/:sectionId', authenticate, isInstructor, createSubSection);
// edit sub section
router.put('/subsection/edit/:id', authenticate, isInstructor, editSubSection);
// delete sub section
router.delete('/subsection/delete/:id', authenticate, isInstructor, deleteSubSection);
// get all sub sections of a section
router.get('/subsections/:sectionId', authenticate, getAllSubSections);


// *********** Tags ***********

const {createTagOrCategory, getallTag_s, tagpageDetails} = require('../Controllers/tags');

router.post('/tag/create', authenticate, isAdmin, createTagOrCategory);
router.get('/tag_s', getallTag_s);
router.get('/tag/details', tagpageDetails);

module.exports = router;