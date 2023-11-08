import {
  Length,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsEnum,
} from "class-validator";
import { ProfileType } from "../utils/types";

export default class UserDto {
  @Length(3, 20)
  name: string;

  @Length(10, 14)
  phone: number;

  @IsOptional()
  address: string;

  age: number;

  @IsOptional()
  image: string;

  @IsEmail()
  email: string;

  @Length(6, 15)
  password: string;

  is_Verify: boolean;

  // @IsEnum(ProfileType)
  // profile_type: ProfileType;
}
