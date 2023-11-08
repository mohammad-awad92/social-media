import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import Advertisement from "./Advertisement";
import EntityHistory from "./EntityHistory";


@Entity("temprary_ad")
export default class Tepmorary extends EntityHistory {

    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column()
    start_time: Date;

    @Column()
    end_time: Date;

    @OneToOne(() => Advertisement)
    @JoinColumn()
    advertisement?: Advertisement;
}