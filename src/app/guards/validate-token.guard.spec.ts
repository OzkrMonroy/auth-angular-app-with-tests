import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

import { ValidateTokenGuard } from './validate-token.guard';

class ComponentTestRoute {}

describe('ValidateTokenGuard', () => {
  let guard: ValidateTokenGuard;
  let service = jasmine.createSpyObj('AuthService', ['validateToken']);
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'auth/login', component: ComponentTestRoute },
        ]),
        HttpClientTestingModule,
      ],
      providers: [
        ValidateTokenGuard,
        { provide: AuthService, useValue: service },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    guard = TestBed.inject(ValidateTokenGuard);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('canActive should return false when the token is invalid and the router should be called', () => {
    const routerSpy = spyOn(router, 'navigate');

    service.validateToken.and.returnValue(of(false));
    (guard.canActivate() as any).subscribe({
      next: (resp: any) => {
        expect(resp).toBe(false);
        expect(routerSpy).toHaveBeenCalledWith(['/auth/login']);
      },
    });
  });

  it('canLoad should return false when the token is invalid and the router should be called', () => {
    const routerSpy = spyOn(router, 'navigate');

    service.validateToken.and.returnValue(of(false));
    (guard.canLoad() as any).subscribe({
      next: (resp: any) => {
        expect(resp).toBe(false);
        expect(routerSpy).toHaveBeenCalledWith(['/auth/login']);
      },
    });
  });

  it('canActivate should return true and router should not be to called when the token is valid', () => {
    const routerSpy = spyOn(router, 'navigate');

    service.validateToken.and.returnValue(of(true));
    (guard.canActivate() as any).subscribe({
      next: (resp: any) => {
        expect(resp).toBe(true);
        expect(routerSpy).toHaveBeenCalledTimes(0);
      },
    });
  });

  it('canLoad should return true and router should not be to called when the token is valid', () => {
    const routerSpy = spyOn(router, 'navigate');

    service.validateToken.and.returnValue(of(true));
    (guard.canLoad() as any).subscribe({
      next: (resp: any) => {
        expect(resp).toBe(true);
        expect(routerSpy).toHaveBeenCalledTimes(0);
      },
    });
  });
});
