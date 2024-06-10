class API {
  baseUrl: string;
  token: string;
  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }
  setToken = (token: string) => this.token === token;

  signInRequest = (input: { username: string; password: string }) =>
    fetch(`${this.baseUrl}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

  getUserInfo = (token: string) =>
    fetch(`${this.baseUrl}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });

  getAllUsers = (token: string) =>
    fetch(`${this.baseUrl}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
  removeUser = (token: string, id: number) =>
    fetch(`${this.baseUrl}/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
  getAllCourses = (token: string) =>
    fetch(`${this.baseUrl}/courses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
  getCourseById = (token: string, id: number) =>
    fetch(`${this.baseUrl}/courses/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
  startCourse = (courseId: number, userId: number) =>
    fetch(`${this.baseUrl}/courses/${courseId}/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
  getUserCourseProgress = (token: string) =>
    fetch(`${this.baseUrl}/user-course-progress/my`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
  getUserLessonsStatus = (token: string, courseId: number) =>
    fetch(`${this.baseUrl}/courses/${courseId}/lessons-status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    startLesson = (lessonId: number, userId: number, courseId: number) =>
      fetch(`${this.baseUrl}/lessons/${lessonId}/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, courseId }),
      });
      completeLesson = (userId: number, lessonId: number) =>
        fetch(`${this.baseUrl}/lessons/${lessonId}/complete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
};

export const api = new API('http://localhost:3000', '')