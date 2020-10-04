import ISendMailDTO from '../dtos/ISendMailDtos';

export default interface IMailProvider {
  sendMail(data: ISendMailDTO): Promise<void>;
}
