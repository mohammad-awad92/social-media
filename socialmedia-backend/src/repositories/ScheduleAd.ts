import { Repository, EntityRepository, getCustomRepository } from "typeorm";
import ScheduleAd from "../entities/ScheduleAd";

@EntityRepository(ScheduleAd)
class ScheduleRepository extends Repository<ScheduleAd> {
    findById(id: ScheduleAd["id"]) {
        return this.findOne({ id }, { relations: ["advertisement"] });
    };

    findAll() {
        return this.createQueryBuilder("schedule_ad")
            .leftJoinAndSelect("schedule_ad.advertisement", "advertisement")
            .getMany();
    }
};

export default getCustomRepository(ScheduleRepository);