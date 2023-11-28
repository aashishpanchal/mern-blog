import { Expose } from 'class-transformer';
import { UserDto } from '@api-v1/user/dto/user.dto';

export class TokenDto {
  @Expose()
  access: string;

  @Expose()
  refresh: string;
}

export class AuthDto {
  @Expose()
  token: TokenDto;

  @Expose()
  user: UserDto;
}
