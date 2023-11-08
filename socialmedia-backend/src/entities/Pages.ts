import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import Advertisement from "./Advertisement";
import EntityHistory from "./EntityHistory";
import SocialMediaAccount from "./SocialMediaAcount";

@Entity("pages")
export default class Pages extends EntityHistory {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  accessToken?: string;

  @Column()
  category?: string;

  @Column()
  name?: string;

  @Column()
  page_id?: string;

  @ManyToOne(() => SocialMediaAccount, (socail) => socail.page, {
    nullable: true,
  })
  socailAccount?: SocialMediaAccount;

  @OneToMany(() => Advertisement, (ad) => ad.page)
  advertisement?: Advertisement[];
}
