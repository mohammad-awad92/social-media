import { Entity, Column,PrimaryGeneratedColumn } from "typeorm";
import EntityHistory from "./EntityHistory";
import { ProfileType } from "../utils/types";

@Entity("admin")
export default class Admin extends EntityHistory {

    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    image: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    profile_type: ProfileType;
}