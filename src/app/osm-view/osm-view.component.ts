import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, AfterViewInit } from '@angular/core'
import { marker } from './marker.image'
import { proj, View } from 'openlayers'
import { HttpClient } from '@angular/common/http'
import { Subscription } from 'rxjs'
import { GeoLocationService } from './geo-location.service'

@Component({
  selector: 'vo-ui-osm-view',
  templateUrl: './osm-view.component.html',
  styleUrls: ['./osm-view.component.css'],
  providers: [HttpClient, GeoLocationService]
})

export class OsmViewComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  geoReverseService = 'https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat={lat}&lon={lon}'

  @Input()
  width: string
  @Input()
  height: string

  @Input()
  latitude = 52.520008
  @Input()
  longitude = 13.404954

  @Input()
  latitudePointer = 52.520008
  @Input()
  longitudePointer = 13.404954

  @Input()
  showControlsZoom: boolean
  @Input()
  titleZoomIn = 'Zoom in'
  @Input()
  titleZoomOut = 'Zoom out'
  @Input()
  showControlsCurrentLocation: boolean
  @Input()
  titleCurrentLocation = 'Current location'

  @Input()
  showDebugInfo: boolean
  @Input()
  opacity = 1
  @Input()
  zoom = 14
  @Input()
  futurHotspots: any;

  markerImage = marker

  reverseGeoSub: Subscription = null
  pointedAddress: string
  pointedAddressOrg: string
  position: any
  installedHotspots: Promise<any>
  dirtyPosition

  @Output()
  addressChanged = new EventEmitter<any>()

  constructor(private httpClient: HttpClient, private geoLocationService: GeoLocationService) {
  }
  ngAfterViewInit(): void {

  }

  ngOnInit() {
    if (this.showControlsCurrentLocation) {
      this.geoLocationService.getLocation().subscribe((position) => {
        this.position = position
        if (!this.dirtyPosition) {
          this.dirtyPosition = true
          this.longitude = this.longitudePointer = this.position.coords.longitude
          this.latitude = this.latitudePointer = this.position.coords.latitude
        }
      })
    }
    this.getAllInstalledHotspots();
  }

  private getAllInstalledHotspots(){
    fetch('https://api.helium.io/v1/hotspots')
    .then(function(response) {
      return response.json();
    })
    .then((myJson) => {
      this.installedHotspots = myJson.data.map(({lng, lat}) => ({lng, lat}));
    });
  }

  ngOnDestroy() {
    if (this.reverseGeoSub) {
      this.reverseGeoSub.unsubscribe()
    }
  }
  onSingleClick(event) {
    const lonlat = proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326')
    this.longitudePointer = lonlat[0]
    this.latitudePointer = lonlat[1]
    this.reverseGeo()
  }
  increaseOpacity() {
    this.opacity += 0.1
  }

  decreaseOpacity() {
    this.opacity -= 0.1
  }
  increaseZoom() {
    this.zoom++
  }
  decreaseZoom() {
    this.zoom--
  }

  setCurrentLocation(event) {
    // TODO FIX: setting current location does move the pointer but not the map!!!
    if (this.position) {
      this.longitude = this.longitudePointer = this.position.coords.longitude
      this.latitude = this.latitudePointer = this.position.coords.latitude
      /**
       * Trigger new address change
       */
      this.reverseGeo()
    }
  }

  reverseGeo() {
    const service = (this.geoReverseService || '')
      .replace(new RegExp('{lon}', 'ig'), `${this.longitudePointer}`)
      .replace(new RegExp('{lat}', 'ig'), `${this.latitudePointer}`)
    this.reverseGeoSub = this.httpClient.get(service).subscribe(data => {
      const val = (data || {})

      this.pointedAddressOrg = val['display_name']
      const address = []

      const building = []
      if (val['address']['building']) {
        building.push(val['address']['building'])
      }
      if (val['address']['mall']) {
        building.push(val['address']['mall'])
      }
      if (val['address']['theatre']) {
        building.push(val['address']['theatre'])
      }

      const zip_city = []
      if (val['address']['postcode']) {
        zip_city.push(val['address']['postcode'])
      }
      if (val['address']['city']) {
        zip_city.push(val['address']['city'])
      }
      const street_number = []
      if (val['address']['street']) {
        street_number.push(val['address']['street'])
      }
      if (val['address']['road']) {
        street_number.push(val['address']['road'])
      }
      if (val['address']['footway']) {
        street_number.push(val['address']['footway'])
      }
      if (val['address']['pedestrian']) {
        street_number.push(val['address']['pedestrian'])
      }
      if (val['address']['house_number']) {
        street_number.push(val['address']['house_number'])
      }

      if (building.length) {
        address.push(building.join(' '))
      }
      if (zip_city.length) {
        address.push(zip_city.join(' '))
      }
      if (street_number.length) {
        address.push(street_number.join(' '))
      }

      this.pointedAddress = address.join(', ')

      this.addressChanged.emit({lat: val['lat'], lng: val['lon']})
    })
  }
}