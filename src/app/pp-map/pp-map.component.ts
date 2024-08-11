import { setTheme } from 'ngx-bootstrap';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ElementRef, NgZone, OnInit, ViewChild, Component } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { paData } from '../pa-boundary';
import { AppService } from '../app.service';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-pp-map',
  templateUrl: './pp-map.component.html',
  styleUrls: ['./pp-map.component.scss']
})
export class PPMapComponent implements OnInit {

  title = 'ng6';
  constructor(private http: HttpClient, private appService: AppService, private spinner: NgxSpinnerService, private route: ActivatedRoute,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) {
    setTheme('bs4'); // or 'bs4'
  }
  screenHeight: any = 0;
  lat: Number = 45.9432;
  lng: Number = 24.9668;
  zoom: any = 13;
  @ViewChild("search")
  public searchElementRef: ElementRef;
  map: any;
  ShadeMap = require('mapbox-gl-shadow-simulator/dist/mapbox-gl-shadow-simulator.umd.min.js');

  public innerWidth: any;
  navigation: any;
  inputs: any;
  accessToken: any = 'pk.eyJ1IjoiZmFpemFuNGZpbmUiLCJhIjoiY2s0ODI4ZGpjMHllcjNscXVyM2gxaTB4ZCJ9.1NzDC5BbZ1GODW0TsaOJ7Q';
  step: any = 'open';
  NAList: any = [];
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
  userData: any = {};
  naParcel: any = {};
  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem("userData"));

    console.log(this.userData);
    this.screenHeight = 650;

    this.lat = 30.400867700963577;
    this.lng = 69.41417872258795;
    this.zoom = 5;
    this.step = 'open';
    this.latLng = [this.lng, this.lat];
    this.innerWidth = window.innerWidth;

    console.log(this.value);

    this.naParcel = paData.boundary();
    this.formattingData();
    this.getVoteList();
  }

  voteDataList: any = [];
  getVoteList() {
    this.spinner.show();
    this.voteDataList = [];
    this.appService.getVotepp().subscribe(res => {
      if (res.length > 0) {
        res.sort((a, b) => (Number(a.vote) < Number(b.vote)) ? 1 : ((Number(b.vote) < Number(a.vote)) ? -1 : 0));
        this.voteDataList = res;
        this.naParcel.forEach(res => {
          let filteredArray = this.voteDataList.filter(x => x.pp_block == res.properties.PA);
          if (filteredArray.length > 0) {
            res.properties['data'] = filteredArray;
          } else {
            res.properties['data'] = [];
          }
        })

        this.initializeMap(0);
      } else {
        swal('Some Error', '', 'error');
        this.initializeMap(0);
      }
      this.spinner.hide();
    })
  }
  formattingData() {
    this.naParcel.forEach(res => {
      this.NAList.push(res.properties.PA);
    });

    this.NAList.sort((a, b) => (a > b) ? 1 : ((b > a) ? -1 : 0));
  }


  value: number = 0;
  options: Options = {
    floor: 0,
    ceil: 1440,
    step: 1
  };

  latLng: any = [];
  that: any;
  shadeMap: any;
  popup: any;

  initializeMap(type) {
    mapboxgl.accessToken = this.accessToken;
    this.map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/faizan4fine/ck8pxo4us199a1in2adup5z6z', // add your style here
      center: this.latLng,
      zoom: this.zoom, // starting zoom
      projection: 'globe' // display map as a 3D globe
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    this.popup = new mapboxgl.Popup({
      closeButton: false,
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
      placeholder: 'Location'
    });

    document.getElementById('geocoder').appendChild(geocoder.onAdd(this.map));

    var that = this;

    this.map.on('load', () => {
      this.allLayers('');
      this.addMarkers();

      this.map.on('mousemove', 'grid-polygon', (e) => {
        const coordinates = e.lngLat;
        const na = e.features[0].properties.PA;
        const district = e.features[0].properties.District;
        const province = e.features[0].properties.Province;
        let voteData = JSON.parse(e.features[0].properties.data);

        let candidates = '';
        if (voteData && voteData.length > 0) {
          voteData.sort((a, b) => (Number(a.vote) < Number(b.vote)) ? 1 : ((Number(b.vote) < Number(a.vote)) ? -1 : 0));
          voteData.forEach(res => {
            candidates += '<p style="font-size: 14px; color: #6770ff;">' + res.pp_candidate + ' - ' + res.pp_party + ': ('+ res.pp_vote + ')' + '</p>'
          })
        }

        let html = '<div style="width=130px;"><h3>' + na + '</h3>'
          + candidates
          + '<p>District: ' + district + '</p>'
          + '<p>Province: ' + province + '</p></div>'
        
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
  
          that.popup.setLngLat(coordinates)
          that.popup.setHTML(html)
          that.popup.addTo(that.map);
        });
  
        this.map.on('mouseleave', 'grid-polygon', function () {
          that.map.getCanvas().style.cursor = '';
          that.popup.remove();
        });
      });

    

    this.allLayers(type);
  }

  allLayers(type) {
    this.map.addSource('tiles-geojson', {
      type: 'geojson',
      generateId: true,
      data: {
        type: 'FeatureCollection',
        features: this.naParcel
      }
    });

    this.map.addLayer({
      id: 'grid-layer',
      source: 'tiles-geojson',
      type: 'line',
      paint: {
        'line-color': '#000',
        'line-width': 1,
        'line-opacity': 1
      }
    });

    this.map.addLayer({
      id: 'grid-polygon',
      source: 'tiles-geojson',
      type: 'fill',
      paint: {
        'fill-outline-color': 'rgba(0, 204, 204, 1)',
        'fill-color': 'rgba(0, 204, 204, 0.75)',
      }
    });

    this.map.addLayer({
      id: 'na-numbers',
      type: 'symbol',
      source: 'tiles-geojson',
      layout: {
        'text-field': ['get', 'PA'],
        'text-size': 12,
        'text-anchor': 'top'
      },
      paint: {
        'text-color': '#000',
        'text-halo-color': '#FFF',
        'text-halo-width': 2
      }
    });
  }

  addMarkers() {
    this.naParcel.forEach((parcel) => {
      const centroidData = this.calculateCentroid(parcel.geometry.coordinates[0][0], parcel.properties.PA);
      const popup = new mapboxgl.Popup().setHTML('<h3>' + centroidData.naNumber + '</h3>');
      const marker = new mapboxgl.Marker().setLngLat(centroidData.centroid).addTo(this.map);
      marker.setPopup(popup);
      marker.openPopup();
    });
  }

  calculateCentroid(coordinates, naNumber) {
    let centerX = 0,
      centerY = 0;

    for (let i = 0; i < coordinates.length; i++) {
      centerX += coordinates[i][0];
      centerY += coordinates[i][1];
    }

    centerX /= coordinates.length;
    centerY /= coordinates.length;

    return {
      centroid: [centerX, centerY],
      naNumber: naNumber
    };
  }

  onStyleChange(style) {
    this.map.setStyle('mapbox://styles/' + style);
  }

  selectedProvince: any = '';
  selectProvince(val) {
    this.selectedProvince = val;
    this.changeLayer('province', val);
  }

  selectedPA: any = '';
  selectPA(val) {
    this.selectedPA = val;
    this.changeLayer('pa', val);
  }

  selectedProvinceParcel: any = [];
  changeLayer(type, val) {
    if (type === 'province') {
      let parcel = [];
      this.selectedProvinceParcel = [];
      this.NAList = [];
      if (val === '') {
        this.naParcel.forEach(res => {
          this.NAList.push(res.properties.PA);
        });
        parcel = this.naParcel;
      } else {
        this.naParcel.forEach(res => {
          if (res.properties.Province === val) {
            this.selectedProvinceParcel.push(res);
            this.NAList.push(res.properties.PA);
          }
        });
        parcel = this.selectedProvinceParcel;
      }

      this.map.getSource('tiles-geojson').setData({
        type: 'FeatureCollection',
        features: parcel
      });

      let zoom = 5;
      if (val === '') {
        zoom = 4;
      }

      if (parcel.length > 0) {
        this.map.flyTo({
          center: [parcel[0].geometry.coordinates[0][0][0][0], parcel[0].geometry.coordinates[0][0][0][1]],
          zoom: zoom,
          speed: 1,
        });
      }
    }

    if (type === 'pa') {
      let parcel = [];
      if (val === '') {
        if (val === '' && this.selectedProvinceParcel.length === 0) {
          parcel = this.naParcel;
        } else {
          parcel = this.selectedProvinceParcel;
        }
      } else {
        if (this.selectedProvinceParcel.length === 0) {
          this.naParcel.forEach(res => {
            if (res.properties.PA === val) {
              parcel.push(res);
            }
          });
        } else {
          this.selectedProvinceParcel.forEach(res => {
            if (res.properties.PA === val) {
              parcel.push(res);
            }
          });
        }
      }

      this.map.getSource('tiles-geojson').setData({
        type: 'FeatureCollection',
        features: parcel
      });

      if (parcel.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        parcel[0].geometry.coordinates[0][0].forEach(coordinate => {
          bounds.extend(coordinate);
        });

        this.map.fitBounds(bounds, {
          padding: 50,
          maxZoom: 14,
          speed: 0.5,
          curve: 1.2
        });

        const centroidData = this.calculateCentroid(parcel[0].geometry.coordinates[0][0], val);
        const popup = new mapboxgl.Popup().setHTML('<h3>' + centroidData.naNumber + '</h3>');
        const marker = new mapboxgl.Marker().setLngLat(centroidData.centroid).addTo(this.map);
        marker.setPopup(popup);
        marker.openPopup();
      }
    }

    this.NAList.sort((a, b) => (a > b) ? 1 : ((b > a) ? -1 : 0));
  }
}
