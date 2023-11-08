import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import Advertisement from "./Advertisement";
import EntityHistory from "./EntityHistory";


@Entity("schedule_ad")
export default class Schedule extends EntityHistory {

    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column({ type: "datetime" })
    time_date?: Date;

    @OneToOne(() => Advertisement)
    @JoinColumn()
    advertisement?: Advertisement;
};