import { EntityRepository, Repository, getCustomRepository } from "typeorm";
import Pages from "../entities/Pages";

@EntityRepository(Pages)
class PagesRepository extends Repository<Pages> {
  findById(id: Pages["id"]) {
    return this.findOne({ id }, { relations: ["socailAccount"] });
  }
  findAll() {
    return this.createQueryBuilder("pages").getMany();
  }
  findByPagePlatformId(pageId: string) {
    return this.findOne({
      where: {
        page_id: pageId,
      },
    });
  }
}

export default getCustomRepository(PagesRepository);
