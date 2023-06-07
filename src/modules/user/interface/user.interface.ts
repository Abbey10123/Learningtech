export interface UserInterface {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    userType: UserType;
    isVerified: boolean;
    image_url: string;
  }

  export enum UserType {
    Admin = 'administrator',
    Student = 'student',
    Tutor = 'tutor',
  }
  
//   export enum Gender {
//     Male = 'male',
//     Female = 'female'
//   }