import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Personal } from './models/personal.model';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss'],
})
export class PersonalComponent implements OnInit {
  // @ts-ignore
  formGroup: FormGroup;
  editForm: boolean = false;
  isPersonalList: boolean = false;
  indexPersonal: number = 0;
  personalList: Personal[] = [];
  // @ts-ignore
  _personalList$: BehaviorSubject<Personal[]>;
  // @ts-ignore
  personalList$: Observable<Personal[]>;
  // @ts-ignore
  requestModel: Personal;

  constructor(private fb: FormBuilder, private toastr: ToastrService) {
    this._personalList$ = new BehaviorSubject<Personal[]>([]);
    this.personalList$ = this._personalList$.asObservable();
  }

  ngOnInit(): void {
    this.loadPersonalList();
  }

  loadPersonalList() {
    this.loadForm();
    let personalList = localStorage.getItem('personalList');
    if (personalList) {
      this.isPersonalList = true;
      this.personalList = JSON.parse(personalList);
      this.reloadSubject();
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      surname: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required])],
    });
  }

  reloadSubject() {
    this._personalList$.next(this.personalList);
    localStorage.setItem('personalList', JSON.stringify(this.personalList));
  }

  add(model: Personal) {
    this.personalList.push(model);
    this.toastr.success('Personal added successfully.', 'The operation is successful')
    this.reloadSubject();
  }

  edit(model: Personal) {
    this.personalList[this.indexPersonal].name = model.name;
    this.personalList[this.indexPersonal].surname = model.surname;
    this.personalList[this.indexPersonal].email = model.email;
    this.toastr.success('Personal has been successfully updated.', 'The operation is successful')
    this.reloadSubject();
    this.resetForm();
  }

  detail(model: Personal, index: number) {
    this.loadForm();
    this.editForm = true;
    this.indexPersonal = index;
    this.indexPersonal = +this.indexPersonal;
    this.formGroup.patchValue({
      name: model.name,
      surname: model.surname,
      email: model.email,
    });
  }

  delete(model: Personal) {
    const index = this.personalList.indexOf(model);
    if (index !== -1) {
      this.personalList.splice(index, 1);
      this.toastr.success('Personal has been successfully deleted.', 'The operation is successful')
      this.reloadSubject();
    }
  }

  resetForm() {
    this.loadForm();
    this.editForm = false;
  }

  private prepareForm() {
    let formValue = this.formGroup.value;
    this.requestModel = {
      name: formValue.name,
      surname: formValue.surname,
      email: formValue.email,
    };
  }

  save() {
    this.prepareForm();
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      if (this.editForm) {
        this.edit(this.requestModel);
      } else {
        this.add(this.requestModel);
      }
      localStorage.setItem('personalList', JSON.stringify(this.personalList));
    } 
    else {
      this.toastr.warning('Please check the form.', 'Operation failed')
    }
  }

  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
}
