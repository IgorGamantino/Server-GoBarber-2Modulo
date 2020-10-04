import AppError from '@shared/Errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('shoud be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '1234',
    });
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('1234');
  });

  it('Shoud not be albe to create two appointments on the same time', async () => {
    const appointmentDate = new Date();

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '1234',
    });

    expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '1234',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
