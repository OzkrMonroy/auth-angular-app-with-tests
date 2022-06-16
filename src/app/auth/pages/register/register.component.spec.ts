import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RegisterComponent } from './register.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../services/auth.service';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  DebugElement,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router, RouterLinkWithHref } from '@angular/router';
import { of } from 'rxjs';
import { loginErrorResponse } from '../../../mocks/auth.mocks';
import Swal from 'sweetalert2';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let registerForm: FormGroup;
  let service: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
      providers: [AuthService],
      declarations: [RegisterComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    registerForm = component.registerForm;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Login should have a router link to register page', () => {
    const debugElement: DebugElement = fixture.debugElement.query(
      By.directive(RouterLinkWithHref)
    );
    expect(debugElement.attributes['routerLink']).toBe('/auth/login');
  });

  it('The login should have three fields', () => {
    expect(registerForm.contains('email')).toBeTruthy();
    expect(registerForm.contains('password')).toBeTruthy();
    expect(registerForm.contains('name')).toBeTruthy();
  });

  it('The form should be invalid when the fields are empty', () => {
    const emailField = registerForm.get('email');
    const passwordField = registerForm.get('password');
    const nameField = registerForm.get('name');
    emailField?.setValue('');
    passwordField?.setValue('');
    nameField?.setValue('');
    expect(registerForm.invalid).toBeTruthy();
  });

  it('The email field has to be invalid when the value it is not an email or is empty', () => {
    const emailField = registerForm.get('email');
    emailField?.setValue('');
    expect(emailField?.invalid).toBeTruthy();
    emailField?.setValue('test@');
    expect(emailField?.invalid).toBeTruthy();
  });

  it('The password field has to be invalid when the value length is less than 6 or is empty', () => {
    const passwordField = registerForm.get('password');
    passwordField?.setValue('');
    expect(passwordField?.invalid).toBeTruthy();
    passwordField?.setValue('12345');
    expect(passwordField?.invalid).toBeTruthy();
  });

  it('The name field has to be invalid when the value length is equals to 0', () => {
    const nameField = registerForm.get('name');
    nameField?.setValue('');
    expect(nameField?.invalid).toBeTruthy();
  });

  it('The form should be valid and the service should be called when the two fields have correct values', () => {
    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    const serviceSpy = spyOn(service, 'register').and.returnValue(of(true));
    const routerSpy = spyOn(router, 'navigateByUrl');
    const passwordField = registerForm.get('password');
    const emailField = registerForm.get('email');
    const nameField = registerForm.get('name');

    passwordField?.setValue('123456');
    emailField?.setValue('test1@test.com');
    nameField?.setValue('Test 1');

    expect(registerForm.valid).toBeTrue();
    component.register();

    expect(serviceSpy).toHaveBeenCalledWith(
      'test1@test.com',
      '123456',
      'Test 1'
    );
    expect(routerSpy).toHaveBeenCalledOnceWith('/dashboard');
  });

  it('The form should be valid and the service should be called, but the alert should be displayed', () => {
    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    const serviceSpy = spyOn(service, 'register').and.returnValue(
      of({ error: { ...loginErrorResponse } })
    );
    const routerSpy = spyOn(router, 'navigateByUrl');
    const swalSpy = spyOn(Swal, 'fire');

    const passwordField = registerForm.get('password');
    const emailField = registerForm.get('email');
    const nameField = registerForm.get('name');

    passwordField?.setValue('123456');
    emailField?.setValue('test1@test.com');
    nameField?.setValue('Test 1');

    expect(registerForm.valid).toBeTrue();
    component.register();

    expect(serviceSpy).toHaveBeenCalledWith(
      'test1@test.com',
      '123456',
      'Test 1'
    );
    expect(routerSpy).toHaveBeenCalledTimes(0);
    expect(swalSpy).toHaveBeenCalledOnceWith(
      'Error',
      loginErrorResponse.msg,
      'error'
    );
  });
});
