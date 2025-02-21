export interface Faculty {
  id: string;
  name: string;
  email: string;
  shortName: string;
  designation: string;
  department: string;
  isActive: boolean;
}

export interface CreateFacultyInput {
  email: string;
  name: string;
  shortName: string;
  designation: string;
}

export interface FacultyResponse {
  success: boolean;
  data: Faculty[];
}

export interface AssignFacultyResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    facultyId: string;
    faculty: Faculty | null;
  };
} 