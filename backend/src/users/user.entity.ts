import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    usr_id: number;

    @Column("text")
    usr_email: string;

    @Column("text")
    usr_hash: string;

    @Column("int")
    usr_root: number;
}
