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
  geoReverseService = 'https://nominatim.openstreetmap.org/reverse?key=iTzWSiYpGxDvhATNtSrqx5gDcnMOkntL&format=json&addressdetails=1&lat={lat}&lon={lon}'

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

  markerImage = marker

  reverseGeoSub: Subscription = null
  pointedAddress: string
  pointedAddressOrg: string
  position: any
  installedHotspots: Promise<any>
  futurHotspots: Promise<any>
  dirtyPosition

  @Output()
  addressChanged = new EventEmitter<String>()

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
    this.getAllFuturHotspots();
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

  private getAllFuturHotspots(){
    fetch('http://localhost:8080/hotspots')
    .then(function(response) {
      return response.json();
    })
    .then((myJson) => {
      this.futurHotspots = myJson.map(({lng, lat}) => ({lng, lat}));
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
    })
  }
}