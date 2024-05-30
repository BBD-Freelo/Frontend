import { Injectable } from '@angular/core';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  async getCurrentUser(): Promise<any> {
    try {
      const user = await getCurrentUser();
      console.log("🚀 ~ AuthService ~ getCurrentUser ~ user:", user)
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }

  async getUserSession(): Promise<any> {
    try {
      const session = await fetchAuthSession();
      console.log("🚀 ~ AuthService ~ getUserSession ~ session:", session)
      return session;
    } catch (error) {
      console.error('Error fetching user session:', error);
      throw error;
    }
  }

}
