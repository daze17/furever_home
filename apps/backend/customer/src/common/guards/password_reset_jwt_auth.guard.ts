import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class PasswordResetJwtAuthGuard extends AuthGuard(
  "password_reset_jwt_strategy",
) {}
