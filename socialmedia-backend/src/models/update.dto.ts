import { Length, IsOptional, IsEmail, IsBoolean, IsEnum } from "class-validator";
import { ProfileType } from "../utils/types";

export default class UpdateUserDto {
   
    name?: string;

    phone?: number;

    address?: string;

    age?: number;

    image?: string;

    email?: string;

    password?: string;

    is_Verify?: boolean;

    // @IsEnum(ProfileType)
    // profile_type: ProfileType;
}