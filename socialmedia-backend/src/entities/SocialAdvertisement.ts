import { Entity, Column, PrimaryGeneratedColumn, ManyToOne  } from "typeorm";
import Advertisement from "./Advertisement";
import EntityHistory from "./EntityHistory";
import SocialMediaAccount from "./SocialMediaAcount";
import Pages from "./Pages";

@Entity("social_advertisement")
export default class Social_Advertisement extends EntityHistory {

    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @ManyToOne(() => Advertisement, (ad) => ad.Sociala_dvertisement)
    advertisement?: Advertisement;

    @ManyToOne(() => SocialMediaAccount, (social) => social.socailMedia)
    socailMediaAccount?: SocialMediaAccount;
}