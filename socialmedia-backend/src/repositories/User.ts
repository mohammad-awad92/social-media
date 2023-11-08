import { Repository, EntityRepository, getCustomRepository } from "typeorm";
import User from "../entities/User";

@EntityRepository(User) // هنا كلشي كويري لح تجي لح تكون على هذا الجدول
class UserRepository extends Repository<User> {
    findById(id: User["id"]){
        return this.findOne({ id });
    }

    findByEmail(email: string){
        return this.createQueryBuilder("users")
            .where("users.email = :email", { email: email })
            .addSelect("users.password")
            .getOneOrFail();
    };
};

export default getCustomRepository(UserRepository); // ال getCus هي يلي بطلعو لبرا مشان الكل يشوفو