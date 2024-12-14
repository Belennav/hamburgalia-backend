import HttpStatusCodes from '@src/common/HttpStatusCodes';

class RouteError extends Error {

  public status: HttpStatusCodes;

  public constructor(status: HttpStatusCodes, message: string) {
    super(message);
    this.status = status;
  }
}

export default RouteError;
