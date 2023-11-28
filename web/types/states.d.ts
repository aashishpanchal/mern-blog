declare namespace States {
  export interface UserState {
    id: string;
    email: string;
    avatar: string;
    username: string;
    fullname: string;
    isBlocked: boolean;
    isEmailVerified: boolean;
    loginAt: string;
    createdAt: string;
    updatedAt: string;
    [key: string]: any;
  }
}
