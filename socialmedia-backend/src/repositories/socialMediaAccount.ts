import { Repository, EntityRepository, getCustomRepository } from "typeorm";
import SocialMediaAccount from "../entities/SocialMediaAcount";

@EntityRepository(SocialMediaAccount)
class SocialMediaAccountRepository extends Repository<SocialMediaAccount> {
  findByUserId(userId: string) {
    return this.createQueryBuilder("social_Media_Account")
      .leftJoinAndSelect("social_Media_Account.user", "user")
      .where("social_Media_Account.userId = :userId", { userId: userId })
      .getMany();
  }

  findAll() {
    return this.createQueryBuilder("social_media_account")
      .leftJoinAndSelect("social_media_account.users", "users")
      .getMany();
  }
}

export default getCustomRepository(SocialMediaAccountRepository);
