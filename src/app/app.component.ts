import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  signupForm: FormGroup;
  forbiddenUsernames = ['Chris', 'Anna'];

  ngOnInit() {
    this.signupForm = new FormGroup({
      'userData': new FormGroup({
        'username': new FormControl(null, [Validators.required, this.forbiddenNames.bind(this)]), 
        'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails)        
      }),
      'gender': new FormControl('female'), 
      'hobbies': new FormArray([])
    });
    // this.signupForm.valueChanges.subscribe(
    //   (value) => console.log(value)
    // )
    this.signupForm.statusChanges.subscribe(
      (status) => console.log(status)
    );
    this.signupForm.setValue({
      'userData': {
        'username': 'Max',
        'email': 'max@test.com'
      },
      'gender': 'male',
      'hobbies': []
    });
    this.signupForm.patchValue({
      'userData': {
        'username': 'Anna'
      },
    });
  }

  onSubmit() {
    console.log(this.signupForm);
    this.signupForm.reset();
  }

  getControls() {
    return (<FormArray>this.signupForm.get('hobbies')).controls;
  }

  onAddHobby() {
    // below, need to tell TypeScript that this is of type FormArray to not get an error. 
    // You rarely have to do this, but here we have to explicitly cast this. So by placing a lower than sign then FormArray and then a greater than sign and placing this in parentheses, we're telling TypeScript: This part here is actually a FormArray, so everything enclosed in these outer parentheses now is treated as FormArray, so now I can push a new control on this array. If we would not have casted this, we would get an error. So now we can push a new control on this array (like .push(new FormControl)). So now we can push a new FormControl there, but I will outsource this to keep the line short. So first we'll use const control = new FormControl() so the control is created and stored in the constant, and the hobby should be something the user can enter, so we'll create it with null default value. 
    // You could change the behavior to pass an argument to onAddHobby and then pre-populate it... 
    // Also add a validator! And make sure to synchronize it with the HTML code. 
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(control);
  }

// this isn't working properly, probably because of the html.
  forbiddenNames(control: FormControl): {[s: string]: boolean}{
    if (this.forbiddenUsernames.indexOf(control.value) !== -1 ) {
      return {'nameIsForbidden': true};
    }
    return null;
  }

  forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          resolve({'emailIsForbidden': true});
        } else {
          resolve(null);
        }
      }, 1500);
    });
    return promise;
  }
}
