import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { UserType, UserInterface, Gender } from '../Interface/user.interface';

@Entity({name: 'users'})
export class User implements UserInterface {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({name: 'first_name'})
    firstName: string;
  
    @Column({name: 'last_name'})
    lastName: string;
  
    @Column()
    email: string;

    @Column({type: 'enum', enum: Gender, nullable :true})
    gender: Gender;
  
    @Column({type: 'enum', enum: UserType, default: UserType.Student, nullable: false})
    userType: UserType;
  
    @Column({nullable: true})
    password: string;
  
    @Column({nullable: true})
    image_url: string;
  
    @Column({name: 'phone_number', nullable: true})
    phoneNumber: string;

    @Column({nullable: true})
    isVerified: boolean;

    @Column({nullable: true})
    course: string
}