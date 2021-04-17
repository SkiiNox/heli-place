import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-modify-hotspot',
  templateUrl: './create-modify-hotspot.component.html',
  styleUrls: ['./create-modify-hotspot.component.css']
})
export class CreateModifyHotspotComponent implements OnInit {
  hotspotForm: FormGroup;
  private numberWithTwoMaxDigit: RegExp = /^\d+((\.|\,)\d{1,2})?$/
  private numberValidators = [
    Validators.pattern(this.numberWithTwoMaxDigit)
  ];
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.hotspotForm = this.formBuilder.group({
      id: '',
      lng: '',
      lat: '',
      antennaHeight: this.formBuilder.control('', this.numberValidators),
      antennaPower: this.formBuilder.control('', this.numberValidators),
      hotspot: '',
    });

    this.hotspotForm.get('antennaHeight').valueChanges
    .subscribe(value => {
      if(value)
        this.hotspotForm.get('antennaHeight').setValidators(this.numberValidators.concat(Validators.required))
      else
        this.hotspotForm.get('antennaHeight').setValidators(this.numberValidators);
    });

    this.hotspotForm.get('antennaPower').valueChanges
    .subscribe(value => {
      if(value)
        this.hotspotForm.get('antennaPower').setValidators(this.numberValidators.concat(Validators.required))
      else
        this.hotspotForm.get('antennaPower').setValidators(this.numberValidators);
    });
  }

  saveNewHotspot(){
    console.log(this.hotspotForm);
  }

}
