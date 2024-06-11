export interface IUser {
  avatar: string;
  email: string;
  username: string;
  createdAt: Date;
  id: number;
}

export interface ICourse {
    id: number;
    description: string;
    name: string;
}

export interface IProgress {
    id: number;
    status: 'not_started' | 'in_progress' | 'completed';
    course: ICourse;
    completedAt: Date;
}

export interface ILesson {
  id: number;
  course: ICourse;
  title: string;
  content: string;
  orderNumber: number;
  userProgress: IProgress;
}

export interface ILessonProgress {
  id: number;
  status: string;
  lesson: ILesson;
}