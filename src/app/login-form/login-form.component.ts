import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { map, take, debounceTime } from 'rxjs/operators';


@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.sass']
})
export class LoginFormComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private afs: AngularFirestore, private fb: FormBuilder) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email:  ['', [
        Validators.required, 
        Validators.email
      ]],
      username:  ['', 
        Validators.required,
        CustomValidator.username(this.afs) 
      ],
    });

  }


  // Use getters for cleaner HTML code
  get email() {
    return this.loginForm.get('email')
  }

  get username() {
    return this.loginForm.get('username')
  }


  

}


// interface Validator<T extends FormControl> {
//   (c:T): {[error: string]:any};
// }


export class CustomValidator {
  static username(afs: AngularFirestore) {
    return (control: AbstractControl) => {

      const username = control.value.toLowerCase();
      
      return afs.collection('users', ref => ref.where('username', '==', username) )
                
        .valueChanges().pipe(
          debounceTime(500),
          take(1),
          map(arr => arr.length ? { usernameAvailable: false } : null ),
        )
    }
  }

}
