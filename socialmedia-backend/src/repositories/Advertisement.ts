import { findAll } from "./../services/scheduleAd.service";
import { Repository, EntityRepository, getCustomRepository } from "typeorm";
import Advertisement from "../entities/Advertisement";

@EntityRepository(Advertisement)
class AdvertisementRepository extends Repository<Advertisement> {
  findById(id: Advertisement["id"]) {
    return this.findOne({ id }, { relations: ["user"] });
  }
  findAll(userId: string) {
    return (
      this.createQueryBuilder("advetisement")
        .leftJoinAndSelect("advetisement.user", "user")
        // .leftJoinAndSelect("advetisement.sourceId", "pages")
        .where("advetisement.userId = :userId", { userId: userId })
        // .where("advetisement.sourceId = :pageId", { pageId: userId })
        .getMany()
    );
  }
}

export default getCustomRepository(AdvertisementRepository);
