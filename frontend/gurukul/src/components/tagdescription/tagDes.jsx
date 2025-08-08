import React, { useEffect, useState } from 'react';
import { apiConnector } from '../../service/apiconnector';
// import { coursePageEndpoints } from '../services/apis';
import CourseCard from '../courseCard/coursecard';
import { IoIosArrowForward } from "react-icons/io";
import './tagDes.css';
import { useParams } from 'react-router-dom';
import { getTagDes } from '../../service/apis';
import { useNavigate } from 'react-router-dom';
const CoursePage = () => {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { tagid } = useParams();
  const [tagData, setTagData] = useState({})
  const [topData, setTopData] = useState(null)
  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      try {
        const url = `${getTagDes.GET_TAG_API}/${tagid}`;
        const response = await apiConnector("GET", url);
        setTagData(response.data.tag);
        setCourseData(response.data.tag.course)
        setTopData(response.data.topSellingCourses);
      } catch (error) {
        console.error("Could not fetch course details:", error);
      }
      setLoading(false);
    };

    fetchCourseDetails();
  }, [tagid]);

  if (loading || !courseData) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="course-page-container-forTag">
      <div className="upperTag-forTag">
        <div className="breadcrumb-forTag">
          Home / Catalog / <span className="breadcrumb-active-forTag">{tagData.name}</span>
        </div>
        <h1 className="course-title-forTag">{tagData.name}</h1>
        <p className="course-description-forTag">{tagData.Description}</p>
      </div>
      <div className="carousalSection-forTag">
        <div className="course-section-forTag">
          <h2 className="section-title-forTag">Courses to get you Started</h2>
          <div className="courses-carousel-forTag" >
            {courseData.map((course) => (
              <div className="carddds"  onClick={()=>navigate(`/course_details/${course._id}`)}>
                <CourseCard key={course._id} course={course} />
              </div>
            ))}
          </div>
          <IoIosArrowForward className="carousel-arrow-forTag" />
        </div>

        <div className="course-section-forTag">
          <h2 className="section-title-forTag">Our Top courses </h2>
          <div className="courses-carousel-forTag">
            {topData.map((course) => (
               <div className="carddds"  onClick={()=>navigate(`/course_details/${course._id}`)}>
                <CourseCard key={course._id} course={course} />
              </div>
            ))}
          </div>
          <IoIosArrowForward className="carousel-arrow-forTag" />
        </div>
      </div>
    </div>
  );
};

export default CoursePage;