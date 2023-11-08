import { IsEmail } from "class-validator";

export default class loginDto {
    @IsEmail()
    email: string;

    password: string;

}