import UserRepository from "../repositories/User";
import User from "../entities/User";
import UserDto from "../models/user.dto";
import { ProfileType } from "../utils/types";
import CustomResponse, { ResponseStatus } from "../utils/customResponse";
import { hash } from "bcrypt";
import UpdateUserDto from "../models/update.dto";

export const createUser = async (userInfo: UserDto): Promise<User> => {
  const user = new User();
  user.name = userInfo.name;
  user.phone = userInfo.phone;
  user.address = userInfo.address;
  user.email = userInfo.email;
  user.age = userInfo.age;
  user.password = await hash(userInfo.password, process.env.BCRYPT_SALT);
  user.image = userInfo.image;
  user.is_Verify = true;
  user.profile_type = ProfileType.USER;
  return await UserRepository.save(user);
};

export const get = async (userId: string): Promise<User> => {
  const user = await UserRepository.findById(userId);
  if (!userId)
    throw new CustomResponse(ResponseStatus.BAD_REQUEST, "User Not Found");
  return user;
};

export const remove = async (userId: string) => {
  const user: User = await get(userId);
  await UserRepository.delete(user.id);
};

export const update = async (
  userId: string,
  userInfo: UpdateUserDto
): Promise<User> => {
  const user: User = await get(userId);
  return await UserRepository.save({
    ...user,
    ...userInfo,
  });
};
