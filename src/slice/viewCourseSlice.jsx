import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  courseSectionData: [],
  courseEntireData: [],
  completedVideos: [],
  totalNoOfLectures: 0,
}

const viewCourseSlice = createSlice({
  name: "viewCourse",
  initialState,
  reducers: {
    setCourseSectionData: (state, action) => {
      state.courseSectionData = action.payload
    },
    setEntireCourseData: (state, action) => {
      state.courseEntireData = action.payload
    },
    setTotalNoOfLectures: (state, action) => {
      state.totalNoOfLectures = action.payload
    },
    setcompletedVideos: (state, action) => {
      state.completedVideos = Array.isArray(action.payload) ? [...action.payload] : [];
    },
    updatecompletedVideos: (state, action) => {
      state.completedVideos = [...state.completedVideos, action.payload]
    },
  },
})

export const {
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
  setcompletedVideos,
  updatecompletedVideos,
} = viewCourseSlice.actions

export default viewCourseSlice.reducer