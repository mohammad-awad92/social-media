import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import EntityHistory from "./EntityHistory";
import Pages from "./Pages";
import Social_Advertisement from "./SocialAdvertisement";
import User from "./User";

@Entity("social_media_account")
export default class SocialMediaAccount extends EntityHistory {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  name?: string;

  @Column()
  socialPlatform?: string;

  @Column({ nullable: true })
  email?: string;

  @Column()
  tokenExpireDate?: number;

  @Column()
  accessToken?: string;

  @Column()
  userPlatformId?: string;

  @ManyToOne(() => User, (user) => user.socail)
  user?: User;

  @OneToMany(() => Social_Advertisement, (social) => social.socailMediaAccount)
  socailMedia?: Social_Advertisement[];

  @OneToMany(() => Pages, (pages) => pages.socailAccount)
  page?: Pages[];
}
