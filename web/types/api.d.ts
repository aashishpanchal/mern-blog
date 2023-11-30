declare module "api-states" {
  export interface APIError {
    error: string;
    message: string;
    statusCode: number;
  }

  export interface APIResponse<T> {
    message: string;
    success: boolean;
    statusCode: number;
    data: T;
  }

  export type UserState = {
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
  };

  export type UserLogin = {
    user: UserState;
    tokens: {
      refreshToken: string;
      accessToken: string;
    };
  };
}
