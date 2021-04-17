import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  id: number;
  lng: number;
  lat: number;
  antennaHeight: number;
  antennaPower: number;
  hotspot: string;
  longitudePointer: any;
  latitudePointer: any;

  showCard: boolean = false;
  hotspotForm: FormGroup;
  searchAdresseForm: FormGroup;
  private numberWithTwoMaxDigit: RegExp = /^\d+((\.|\,)\d{1,2})?$/
  private numberValidators = [
    Validators.pattern(this.numberWithTwoMaxDigit)
  ];

  futurHotspots: Promise<Array<any>>
  foundAdresses: Promise<Array<any>>

  timer;

  constructor(formBuilder: FormBuilder){

    this.searchAdresseForm = formBuilder.group({
      searchString: '',
    });

    this.hotspotForm = formBuilder.group({
      id: this.id,
      lng: this.lng,
      lat: this.lat,
      antennaHeight: formBuilder.control(this.antennaHeight, this.numberValidators),
      antennaPower: formBuilder.control(this.antennaPower, this.numberValidators),
      hotspot: this.hotspot,
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
    this.getAllFuturHotspots();
  }

  private getAllFuturHotspots(){
    fetch('http://localhost:8080/hotspots')
    .then(function(response) {
      return response.json();
    })
    .then((myJson) => {
      this.futurHotspots = myJson.map(({lng, lat}) => ({lng, lat}));
    });
  }

  private getAddressesFromString(searchString: string){
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchString}`)
    .then(function(response) {
      return response.json()
    })
    .then((myJson) => {
      this.foundAdresses = myJson.map(({lat, lon, display_name}) => ({lat, lon, display_name}));
      console.log(this.foundAdresses);
    });
  }

  public searchInterest() {
    const searchAdresseForm = this.searchAdresseForm.value;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.getAddressesFromString(searchAdresseForm.searchString);
    }, 2000);
}


  onAddressChange(event) {
    this.hotspotForm.patchValue({
      lat: event.lat,
      lng: event.lng
    });
    this.showCardComponent();
  }

  saveNewHotspot(){
    const value = this.hotspotForm.value;
    (async () => {
      const rawResponse = await fetch('http://localhost:8080/hotspots', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({lat: value.lat, lng: value.lng})
      });
      (await this.futurHotspots).push(await rawResponse.json());
      this.longitudePointer = 0;
      this.latitudePointer = 0;
      this.hideCardComponent();
    })();
  }

  showCardComponent(){
    this.showCard = true;
  }

  hideCardComponent(){
    this.showCard = false;
  }
}
