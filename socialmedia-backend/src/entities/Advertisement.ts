import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import EntityHistory from "./EntityHistory";
import { Status_AD } from "../utils/types";
import User from "./User";
import Account from "./Account";
import Social_Advertisement from "./SocialAdvertisement";
import Pages from "./Pages";
import { AdvertisementType } from "../utils/types";

@Entity("advetisement")
export default class Advertisement extends EntityHistory {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column({ nullable: true })
  name_Ad?: string;

  @Column()
  Description_AD?: string;

  @Column({ nullable: true })
  Price_AD?: number;

  @Column()
  Status_Ad?: Status_AD;

  @Column({ nullable: true })
  img?: string;

  @Column({ nullable: true })
  link?: string;

  @ManyToOne(() => User, (user) => user.Advertisement)
  user?: User;

  // @ManyToOne(() => Account, (account) => account.advertisement)
  // account?: Account;

  @OneToMany(() => Social_Advertisement, (social) => social.advertisement)
  Sociala_dvertisement?: Social_Advertisement[];

  @ManyToOne(() => Pages, (pages) => pages.advertisement)
  page?: Pages;

  @Column({ nullable: true })
  sourceId?: string;

  @Column({ type: "enum", enum: AdvertisementType })
  sourceType?: AdvertisementType;

  @Column({ nullable: true })
  advertisementId?: string;
}
