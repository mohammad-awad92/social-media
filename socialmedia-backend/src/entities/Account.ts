import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import Advertisement from "./Advertisement";
import EntityHistory from "./EntityHistory";
import User from "./User";

 
@Entity("acount")
export default class Account extends EntityHistory {

    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column()
    name: string;

    // @OneToMany(() => User, (user) => user.account)
    // user?: User[];

    // @OneToMany(() => Advertisement, (adv) => adv.account)
    // advertisement?: Advertisement[];

    
}