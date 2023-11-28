import {
  IsEmail,
  Matches,
  IsString,
  MinLength,
  IsOptional,
  IsNotEmpty,
} from "class-validator";

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  fullname?: string;

  @IsString()
  @MinLength(8, {
    message: "Password must be at least 8 characters.",
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
    }
  )
  password: string;
}
