import logger from "@logpose/logger";

class ApiResponse {
  public statusCode: number;
  public data: any;
  public message: string;
  public success: boolean;
  public metatdata?: any;

  constructor(
    statusCode: number,
    data: any,
    message = "Success",
    metatdata?: any
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;
    this.data = data;
    this.metatdata = metatdata;

    logger.info(this.message);
  }
}

export default ApiResponse;
