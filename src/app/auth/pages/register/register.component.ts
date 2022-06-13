import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
  }

  register(){
    this.router.navigateByUrl('/dashboard');
  }

}
