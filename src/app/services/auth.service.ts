import {Injectable} from '@angular/core';
import {from} from 'rxjs';
import {fetchAuthSession, getCurrentUser} from 'aws-amplify/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  async getCurrentUser(): Promise<any> {
    try {
      return await getCurrentUser();
    } catch (error) {
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
    return (hashValue % 5) + 1;
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
      return await fetchAuthSession();
    } catch (error) {
      throw error;
    }
  }

  getUserAccessToken() {
    return from(
      (async () => {
        try {
          const session = await fetchAuthSession();
          if (session && session.tokens) {
            return session.tokens.accessToken;
          } else {
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
