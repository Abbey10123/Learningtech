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

    @Column({type: 'enum', enum: Gender, nullable :false})
    gender:Gender;
  
    @Column({type: 'enum', enum: UserType, default: UserType.Student, nullable: false})
    userType: UserType;
  
    @Column()
    password: string;
  
    @Column()
    image_url: string;
  
    @Column({name: 'phone_number'})
    phoneNumber: string;

    @Column()
    isVerified: boolean;
}