import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OlgaService } from '../services/olga.service';

const OLGA_COOKIE_NAME = 'OLGA_SETTINGS';

@Component({
  selector: 'cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.scss']
})
export class CookieConsentComponent implements OnInit, AfterViewInit {
  @ViewChild('container') container: ElementRef | null = null;
  constructor(public olga: OlgaService) {
    const cookie = this.getCookie();
    const consent: boolean = (cookie != null && cookie.length > 0);
    this.olga.setCookieConsent(consent);    
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if(!this.olga.cookiesAccepted.value && this.container) {
      this.container.nativeElement.style.visibility = 'visible';
    }
  }

  public getCookie(): string {
      let ca: Array<string> = document.cookie.split(';');
      let caLen: number = ca.length;
      let cookieName = OLGA_COOKIE_NAME + '=';
      for (let i: number = 0; i < caLen; i += 1) {
      if(ca[i].indexOf(cookieName) >= 0) {
            return ca[i].substring(cookieName.length, ca[i].length);
        }
      }
      return '';
  }

  private deleteCookie(name: string): void {
      this.setCookie('', 0);
  }

  public setCookie(value: string, expireDays: number, path: string = '') {
      let d:Date = new Date();
      d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
      let expires:string = `expires=${d.toUTCString()}`;
      let cpath:string = path ? `; path=${path}` : '';
      document.cookie = `${OLGA_COOKIE_NAME}=${value}; ${expires}${cpath}`;
  }

  public consent(consent: boolean): void {
    this.olga.setCookieConsent(consent);
    if (consent) {
        this.setCookie('1', 7);
    }
    if(this.container) {
      this.container.nativeElement.style.visibility = 'hidden';
    }
  }

}
