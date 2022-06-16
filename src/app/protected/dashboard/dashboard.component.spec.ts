import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../auth/services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [AuthService],
      declarations: [DashboardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to login when logout method is called', () => {
    const router = TestBed.inject(Router);
    const service = TestBed.inject(AuthService);

    const spyService = spyOn(service, 'logout').and.callFake(() => of(null));
    const routerSpy = spyOn(router, 'navigate');

    component.logout();
    expect(spyService).toHaveBeenCalledTimes(1);
    expect(routerSpy).toHaveBeenCalledOnceWith(['/auth/login']);
  });

  it('Button should call the logout method when it is clicked', () => {
    const spyLogout = spyOn(component, 'logout').and.callFake(() => null);
    const button: DebugElement = fixture.debugElement.query(By.css('button'));

    button.triggerEventHandler('click', null);
    expect(spyLogout).toHaveBeenCalledTimes(1);
  });
});
