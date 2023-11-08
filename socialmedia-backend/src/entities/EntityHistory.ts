// معرفة اوقات انشاء وحذف و تعديل اي حقل في اي جدول في الداتا بيز هذا يعني ان هذا الجدول سيتم ربطه بكل الجدوال
import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm"; // مكتبة الداتا بيز

export default abstract class EntityHistory {

@CreateDateColumn()
createdAt?: Date;

@UpdateDateColumn()
updatedAt?: Date;

@DeleteDateColumn()
deletedAt?: Date;

};