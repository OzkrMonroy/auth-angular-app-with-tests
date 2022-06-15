import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { registerErrorResponse } from '../../mocks/auth.mocks';
import {
  loginErrorResponse,
  loginSuccessResponse,
  user,
} from '../../mocks/auth.mocks';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService],
      imports: [HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('setUserData should save the user data into localStorage and set the data to user property', () => {
    const lsSpy = spyOn(localStorage, 'setItem').and.callFake(() => null);
    const { ok, ...rest } = loginSuccessResponse;

    service.setUserData(loginSuccessResponse);
    expect(lsSpy).toHaveBeenCalledOnceWith('token', loginSuccessResponse.token);
    expect(service.user).toEqual(rest);
  });

  it('login should resolve a property like true, when the login is correct', () => {
    service.login(user.email, user.password).subscribe({
      next: (resp) => {
        expect(resp).toBe(true);
      },
    });
    const req = httpMock.expectOne(environment.baseUrl + '/auth');
    expect(req.request.method).toBe('POST');
    req.flush(loginSuccessResponse);
  });

  it('Login should resolve an object as response when the login is incorrect', () => {
    service.login(user.email, user.password).subscribe({
      next: (resp) => {
        const { error } = resp;
        const { ok, msg } = error;
        expect(ok).toBe(false);
        expect(msg.trim().length).toBeGreaterThan(0);
        expect(error).toEqual(loginErrorResponse);
      },
    });

    const req = httpMock.expectOne(environment.baseUrl + '/auth');
    expect(req.request.method).toBe('POST');
    req.flush(loginErrorResponse, { status: 400, statusText: 'Bad Request' });
  });

  it('Register should return a true value as response when the register is success', () => {
    service.register('', '', '').subscribe({
      next: (resp) => {
        expect(resp).toBe(true);
      },
    });
    const req = httpMock.expectOne(environment.baseUrl + '/auth/new');
    expect(req.request.method).toBe('POST');
    req.flush(loginSuccessResponse);
  });

  it('Register should return an object as response when the register is incorrect', () => {
    service.register('', '', '').subscribe({
      next: (resp) => {
        const { ok } = resp.error;
        expect(ok).toBe(false);
        expect(resp.error).toEqual(registerErrorResponse);
      },
    });

    const req = httpMock.expectOne(environment.baseUrl + '/auth/new');
    expect(req.request.method).toBe('POST');
    req.flush(registerErrorResponse, {
      status: 400,
      statusText: 'Bad Request',
    });
  });

  it('Validate token should return a true value when the token is valid', () => {
    service.validateToken().subscribe({
      next: (resp) => {
        expect(resp).toBe(true);
      },
    });

    const req = httpMock.expectOne(environment.baseUrl + '/auth/renew');
    expect(req.request.method).toBe('GET');
    req.flush(loginSuccessResponse);
  });

  it('Validate token should return a false value when the token is invalid', () => {
    service.validateToken().subscribe({
      next: (resp) => {
        expect(resp).toBe(false);
      },
    });

    const req = httpMock.expectOne(environment.baseUrl + '/auth/renew');
    expect(req.request.method).toBe('GET');
    req.flush('', { status: 401, statusText: 'Unauthorized' });
  });

  it('Logout should clear the localstorage', () => {
    service.setUserData(loginSuccessResponse);
    expect(localStorage.length).toBe(1);
    service.logout();
    expect(localStorage.length).toBe(0);
  });
});
