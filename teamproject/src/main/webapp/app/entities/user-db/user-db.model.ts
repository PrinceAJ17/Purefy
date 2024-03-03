import { ILandingPage } from 'app/entities/landing-page/landing-page.model';

export interface IUserDB {
  id: number;
  userID?: number | null;
  email?: string | null;
  password?: string | null;
  phoneNumber?: string | null;
  profilePicture?: string | null;
  profilePictureContentType?: string | null;
  userName?: string | null;
  landingPage?: Pick<ILandingPage, 'id'> | null;
}

export type NewUserDB = Omit<IUserDB, 'id'> & { id: null };
