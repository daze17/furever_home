import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class OptionalGuard extends AuthGuard("optional") {
  constructor() {
    super();
  }
  handleRequest(err, user, info) {
    return user;
  }
}
