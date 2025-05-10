import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    usr_id: number;

    @Column("text", { unique: true, nullable: false })
    usr_email: string;

    @Column("text", { nullable: false })
    usr_hash: string;

    @Column("int", { unique: true, nullable: false })
    usr_root: number;
}
