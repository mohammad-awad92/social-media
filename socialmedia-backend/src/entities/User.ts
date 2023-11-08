import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { ProfileType } from "./../utils/types";
import Account from "./Account";
import Acount from "./Account";
import Advertisement from "./Advertisement";
import EntityHistory from "./EntityHistory";
import SocialMediaAccount from "./SocialMediaAcount";

@Entity("users")
export default class User extends EntityHistory {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  name: string;

  @Column()
  phone: number;

  @Column()
  address: string;

  @Column()
  age: number;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  is_Verify: boolean;

  @Column()
  profile_type: ProfileType;

  @OneToMany(() => Advertisement, (ad) => ad.user)
  Advertisement?: Advertisement[];

  @OneToMany(() => SocialMediaAccount, (socail) => socail.user)
  socail?: SocialMediaAccount[];

  // @ManyToOne(() => Account, (acount) => acount.user)
  // account?: Account;
}
