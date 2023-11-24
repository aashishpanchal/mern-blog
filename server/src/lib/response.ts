import httpStatus from "http-status";

export class ApiResponse {
  declare success: boolean;
  declare statusCode: number;
  declare data: any;
  declare message: string;

  constructor(
    data: any = {},
    status: number = 200,
    message: string = "Success"
  ) {
    this.message = message;
    this.success = status >= 200 && status < 300;
    this.statusCode = status;
    this.data = data;
  }

  // common response methods
  static success(data?: any, message: string = "Success") {
    return new ApiResponse(data, httpStatus.OK, message);
  }

  static created(data?: any, message: string = "Created") {
    return new ApiResponse(data, httpStatus.CREATED, message);
  }
}
