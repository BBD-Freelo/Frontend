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

  hashStringToNumber(userId: string) {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
  
  mapUserIdToProfileImage(userId: string): number {
    const hashValue = this.hashStringToNumber(userId);
    const imageIndex = (hashValue % 5) + 1;
    return imageIndex;
  }

  async getProfileUrl(): Promise<string> {
    try {
      const user = await getCurrentUser();
      const index = this.mapUserIdToProfileImage(user.userId);
      return `assets/profile-picture-${index}.png`;
    } catch (error) {
      console.error('Error getting profile url:', error);
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
