import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { loginErrorResponse } from '../../../mocks/auth.mocks';
import Swal from 'sweetalert2';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginForm: FormGroup;
  let service: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      providers: [FormBuilder, AuthService],
      declarations: [LoginComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loginForm = component.loginForm;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('The login should have two fields', () => {
    expect(loginForm.contains('email')).toBeTruthy();
    expect(loginForm.contains('password')).toBeTruthy();
  });

  it('The form should be invalid when the fields are empty', () => {
    const emailField = loginForm.get('email');
    const passwordField = loginForm.get('password');
    emailField?.setValue('');
    passwordField?.setValue('');
    expect(loginForm.invalid).toBeTruthy();
  });

  it('The email field has to be invalid when the value it is not an email or is empty', () => {
    const emailField = loginForm.get('email');
    emailField?.setValue('');
    expect(emailField?.invalid).toBeTruthy();
    emailField?.setValue('test@');
    expect(emailField?.invalid).toBeTruthy();
  });

  it('The password field has to be invalid when the value length is less than 6 or is empty', () => {
    const passwordField = loginForm.get('password');
    passwordField?.setValue('');
    expect(passwordField?.invalid).toBeTruthy();
    passwordField?.setValue('12345');
    expect(passwordField?.invalid).toBeTruthy();
  });

  it('The form should be valid and the service should be called when the two fields have correct values', () => {
    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    const serviceSpy = spyOn(service, 'login').and.returnValue(of(true));
    const routerSpy = spyOn(router, 'navigateByUrl');
    const passwordField = loginForm.get('password');
    const emailField = loginForm.get('email');

    passwordField?.setValue('123456');
    emailField?.setValue('test1@test.com');

    expect(loginForm.valid).toBeTrue();
    component.login();

    expect(serviceSpy).toHaveBeenCalledWith('test1@test.com', '123456');
    expect(routerSpy).toHaveBeenCalledOnceWith('/dashboard');
  });

  it('The form should be valid and the service should be called, but the alert should be displayed', () => {
    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    const serviceSpy = spyOn(service, 'login').and.returnValue(
      of({ error: { ...loginErrorResponse } })
    );
    const routerSpy = spyOn(router, 'navigateByUrl');
    const swalSpy = spyOn(Swal, 'fire');

    const passwordField = loginForm.get('password');
    const emailField = loginForm.get('email');

    passwordField?.setValue('123456');
    emailField?.setValue('test1@test.com');

    expect(loginForm.valid).toBeTrue();
    component.login();

    expect(serviceSpy).toHaveBeenCalledWith('test1@test.com', '123456');
    expect(routerSpy).toHaveBeenCalledTimes(0);
    expect(swalSpy).toHaveBeenCalledOnceWith(
      'Error',
      loginErrorResponse.msg,
      'error'
    );
  });
});
