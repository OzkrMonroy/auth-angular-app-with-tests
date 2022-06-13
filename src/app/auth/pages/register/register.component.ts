import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = this.fb.group({
    email: ['test1@test.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required, Validators.minLength(6)]],
    name: ['Test 1', [Validators.required]]
  })

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
  }

  register(){
    const { email, password, name } = this.registerForm.value;
    this.authService.register(email, password, name).subscribe({
      next: (valid) => {
        if(!valid.error){
          this.router.navigateByUrl('/dashboard');
        }else {
          const { error: { msg } } = valid;
          Swal.fire('Error', msg, 'error');
        }
      }
    })
  }

}
