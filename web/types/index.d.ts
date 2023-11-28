/// <reference path="states.d.ts" />

declare namespace API {
  export interface APIError {
    error: string;
    message: string;
    statusCode: number;
  }
}
