import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
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

  getUserAccessToken() {
    return from(
      (async () => {
        try {
          const session = await fetchAuthSession();
          console.log("🚀 ~ AuthService ~ getUserSession ~ session:", session);
          if (session && session.tokens) {
            console.log("🚀 ~ AuthService ~ getUserSession ~ session:", session);
            return session.tokens.accessToken;
          } else {
            console.error('Error: Session or tokens are undefined');
            throw new Error('Session or tokens are undefined');
          }
        } catch (error) {
          console.error('Error fetching user session:', error);
          throw error;
        }
      })()
    );
  }

}
