import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthProvider, PermissionProvider} from '@juztcode/angular-auth';

@Component({
  selector: 'app-test-auth',
  templateUrl: './test-auth.component.html',
  styles: []
})
export class TestAuthComponent implements OnInit {

  userRole = 0;
  accessTokenCountDown = 0;
  refreshTokenCountDown = 0;
  permissions: any = {};

  constructor(private authProvider: AuthProvider, private permissionProvider: PermissionProvider, private http: HttpClient) {
  }

  ngOnInit() {
    this.startTimer();
    this.getTimeRemaining();
    this.isLoggedIn();
    this.permissions = this.permissionProvider.getPermissions();
  }

  startTimer() {
    setInterval(() => {
      if (this.accessTokenCountDown > 0) {
        this.accessTokenCountDown--;
      }

      if (this.refreshTokenCountDown > 0) {
        this.refreshTokenCountDown--;
      }
    }, 1000);
  }

  setTimeRemaining(accessTokenCountDown: number, refreshTokenCountDown: number) {
    const now = Math.floor(Date.now() / 1000);
    this.accessTokenCountDown = accessTokenCountDown;
    this.refreshTokenCountDown = refreshTokenCountDown;
    localStorage.setItem('access-token-expired-time', (now + accessTokenCountDown).toString());
    localStorage.setItem('refresh-token-expired-time', (now + refreshTokenCountDown).toString());
  }

  getTimeRemaining() {
    const now = Math.floor(Date.now() / 1000);
    const accessTokenExpiredTime = localStorage.getItem('access-token-expired-time');
    const refreshTokenExpiredTime = localStorage.getItem('refresh-token-expired-time');

    if (!accessTokenExpiredTime || !refreshTokenExpiredTime) {
      return;
    }

    const accessTokenTimeRemaining = +accessTokenExpiredTime - now;
    const refreshTokenTimeRemaining = +refreshTokenExpiredTime - now;

    if (accessTokenTimeRemaining > 0) {
      this.accessTokenCountDown = accessTokenTimeRemaining;
    }
    if (refreshTokenTimeRemaining > 0) {
      this.refreshTokenCountDown = refreshTokenTimeRemaining;
    }
  }

  async isLoggedIn() {
    const status = await this.authProvider.isLoggedIn();
    if (status) {
      this.userRole = this.authProvider.getValueInToken<number>('role');
    } else {
      this.userRole = 0;
    }
    console.log('Login status:', status);
  }

  async sendLogin(username: string, password: string) {
    try{
      await this.authProvider.login({username: username, password: password}); 
      this.setTimeRemaining(60, 60 * 5);
    }catch (e) {
      console.error('login failed');
      this.setTimeRemaining(0, 0);
      throw e;
    }
    await this.isLoggedIn();
  }

  async getSecuredResource() {
    try {
      const result = await this.http.get<any>('https://test-angular-packages.herokuapp.com/secured').toPromise();
      console.log('secured route accessed: ' + JSON.stringify(result));
      if (this.accessTokenCountDown === 0) {
        this.setTimeRemaining(60, 60 * 5);
      }
    } catch (e) {
      console.error('secured route access failed')
      this.setTimeRemaining(0, 0);
      throw e;
    }
  }

  async logOut() {
    await this.authProvider.logOut();
    await this.isLoggedIn();
    this.setTimeRemaining(0, 0);
  }

}
