import apiClient from "../../../common/configuration/axios.config";
import type { ICourseEntity } from "../entity/course.entity";

export function useCourse() {
  const fetchItem = async (page: number, limit: number) => {
    const response = await apiClient.get("/course/all-courses", {
      params: {
        page,
        limit,
        search: "",
      },
    });
    console.log("data", response.data);
    return response.data;
  };

  const getAllTeachers = async () => {
    const response = await apiClient.get("/teacher/get-all");
    return response.data;
  };

  const getAllCategories = async () => {
    const response = await apiClient.get("/course/categories");
    return response.data;
  };

  const createCourse = async (courseData: any) => {
    const payload = {
      teacher_id: courseData.teacher_id,
      category_id: courseData.category_id,
      title: courseData.title,
      description: courseData.description,
      duration_hours: Number(courseData.duration_hours),
      max_student: Number(courseData.max_student),
      price: Number(courseData.price),
      end_date: courseData.end_date
        ? new Date(courseData.end_date).toISOString()
        : null,
      start_date: courseData.start_date
        ? new Date(courseData.start_date).toISOString()
        : null,
      registration_start_date: courseData.registration_start_date
        ? new Date(courseData.registration_start_date).toISOString()
        : null,
      registration_end_date: courseData.registration_end_date
        ? new Date(courseData.registration_end_date).toISOString()
        : null,
    };
    console.log("payload", payload);

    const response = await apiClient.post("/course/create-course", payload);
    return response.data;
  };

  const deleteCourse = async (id: number) => {
    const response = await apiClient.delete(`/course/delete-course/${id}`);
    return response.data;
  };

  const updateCourse = async (courseData: ICourseEntity) => {
    const payload = {
      teacher_id: courseData.teacher_id,
      category_id: courseData.category_id,
      title: courseData.title,
      description: courseData.description,
      duration_hours: Number(courseData.duration_hours),
      max_student: Number(courseData.max_student),
      price: Number(courseData.price),
      start_date: courseData.start_date
        ? typeof courseData.start_date === "string"
          ? new Date(courseData.start_date).toISOString()
          : courseData.start_date.toDate().toISOString()
        : null,
      end_date: courseData.end_date
        ? typeof courseData.end_date === "string"
          ? new Date(courseData.end_date).toISOString()
          : courseData.end_date.toDate().toISOString()
        : null,
      register_start_date: courseData.registration_start_date
        ? typeof courseData.registration_start_date === "string"
          ? new Date(courseData.registration_start_date).toISOString()
          : courseData.registration_start_date.toDate().toISOString()
        : null,
      register_end_date: courseData.registration_end_date
        ? typeof courseData.registration_end_date === "string"
          ? new Date(courseData.registration_end_date).toISOString()
          : courseData.registration_end_date.toDate().toISOString()
        : null,
    };
    const response = await apiClient.put(
      `/course/update-course/${courseData.id}`,
      payload
    );
    return response.data;
  };

  return {
    fetchItem,
    getAllTeachers,
    getAllCategories,
    createCourse,
    deleteCourse,
    updateCourse,
  };
}
