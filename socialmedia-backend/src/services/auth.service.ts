import { UserService } from "./index";
import { sign, verify } from "jsonwebtoken";
import { compare } from "bcrypt";
import CustomResponse, { ResponseStatus } from "../utils/customResponse";
import UserRepository from "../repositories/User";
import UserDto from "../models/user.dto";
import User from "../entities/User";

export const login = async (email: string, password: string) => {
  let user: User;
  try {
    user = await UserRepository.findByEmail(email);
  } catch (error) {
    throw new CustomResponse(
      ResponseStatus.UNAUTHORIZED,
      "Email dose not exisit.",
      error
    );
  }
  let compareResult = await compare(password, user.password);
  if (!compareResult)
    throw new CustomResponse(ResponseStatus.UNAUTHORIZED, "Wrong Password");
  let payload = { userId: user.id };
  let token = sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      age: user.age,
      address: user.address,
      phone: user.phone,
      image: user.image,
      email: user.email,
      profileType: user.profile_type,
      is_Verify: user.is_Verify,
    },
  };
};

// export const signUp = async (userDto: UserDto) => {
//   const user = await UserService.createUser(userDto);
//   const loginRes = await login(userDto.email, userDto.password);
//   return loginRes;
// };
export const signUp = async (userDto: UserDto) => {
  const user = await UserService.createUser(userDto);
  // const token = sign({ userId: user.id }, process.env.JWT_SECRET, {
  //   expiresIn: "30d",
  // });

  // // send email=====================================================================

  // // step 1
  // let transporter = nodemailer.createTransport({
  //   service: "gmail",
  //   auth: {
  //     user: process.env.EMAIL,
  //     pass: process.env.PASSWORD,
  //   },
  // });

  // //step 2
  // const url = `http://localhost:8080/auth-user/verifay/${token}`;
  // let mailOptions = {
  //   from: "abc@gmail.com",
  //   to: `${user.name} <${user.email}> `,
  //   subject: "Activate Account",
  //   html: `Confirmation Email.....: <a href="${url}"><h1>link text</h1></a>`,
  // };

  // // Step 3
  // transporter.sendMail(mailOptions, (err: any) => {
  //   if (err) {
  //     return console.log(err, "Error occurs");
  //   }
  //   return console.log("Pleas confirm you email");
  // });
  // const confirm = "Pleas Confirm your Account";

  return { user };
};

//test active=====================================
export const ConfirmationEmial = async (token: any) => {
  const token_verify = <any>verify(token, process.env.JWT_SECRET);
  const { userId } = token_verify;

  return { token_verify, userId };
};
