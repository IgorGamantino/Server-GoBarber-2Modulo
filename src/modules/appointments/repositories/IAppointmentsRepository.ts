import Appointment from '../infra/typeorm/entities/Appointments';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';

export default interface IAppointementsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
}
