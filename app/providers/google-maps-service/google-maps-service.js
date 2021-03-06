import {Page, Storage, SqlStorage, IonicApp, NavController, Alert} from 'ionic-angular';

import {Injectable} from 'angular2/core';

import {Http, URLSearchParams} from 'angular2/http';
import 'rxjs/Rx';


import {DataService} from '../../services/data';

import {ConnectivityService} from '../../providers/connectivity-service/connectivity-service';

// import {LoadingModal} from '../../components/loading-modal/loading-modal';
//
// @Page({
//   templateUrl: 'build/pages/maps/maps.html',
//   directives: [LoadingModal],
// })

@Injectable()
export class GoogleMapsService {

  static get parameters(){
    return [[DataService],[ConnectivityService],[IonicApp],[NavController],[Http]];
  }

  constructor(dataService,connectivityService,app,nav,http){
    this.nav = nav;

    this.http = http;


    this.connectivity = connectivityService;

    this.dataService = dataService;

    this.map = null;
    this.mapInitialised = false;
    this.apiKey = 'AIzaSyD4zGo9cejtd83MbUFQL8YU71b8_A5XZpc';


    this.coords = null;
    this.interpolate = true;



    //fit markers to screen
    this.markers = [];

    //array for point a or display jeepney route
    this.polylines1 = [];
    this.snappedCoordinates1 = [];
    this.lineSymbol1 = null;

    //array for point b
    this.polylines2 = [];
    this.snappedCoordinates2 = [];
    this.lineSymbol2 = null;

    //array for pointc
    this.polylines3 = [];
    this.snappedCoordinates3 = [];
    this.lineSymbol3 = null;

    //array for pointd
    this.polylines4 = [];
    this.snappedCoordinates4 = [];
    this.lineSymbol4 = null;

    //this.latlng1 = coordinates for point a
    this.latlng1 = undefined;
    this.points1 = undefined;

    //this.latlng2 = coordinates for point b
    this.latlng2 = undefined;
    this.points2 = undefined;


    //latlng3 = coordinates for point c
    this.latlng3 = undefined;
    this.points3 = undefined;

    //latlng3 = coordinates for point c
    this.latlng4 = undefined;
    this.points4 = undefined;

    //color of the jeep
    this.color1 = null;
    this.color2 = null;
    this.color3 = null;
    this.color4 = null;

    this.marker = null;

    this.start_new1 = undefined;
    this.start_new2 = undefined;
    this.start_new3 = undefined;
    this.start_new4 = undefined;

    this.end1Ctr = undefined;
    this.end2Ctr = undefined;
    this.end3Ctr = undefined;
    this.end4Ctr = undefined;

    this.lat_array_coords1 = null;
    this.lat_array_coords2 = null;
    this.lat_array_coords3 = null;
    this.lat_array_coords4 = null;

    this.snappedPolyline1 = null;
    this.snappedPolyline2 = null;
    this.snappedPolyline3 = null;
    this.snappedPolyline4 = null;
    this.ctr1 = undefined;
    this.ctr2 = undefined;
    this.ctr3 = undefined;
    this.ctr4 = undefined;

    this.fromId = null;
    this.toId = null;
  }


loadGoogleMaps(opt){
  console.log('enter loadGoogleMaps');
  console.log(this.map);

    var option = opt;

    var me = this;

    me.addConnectivityListeners();

    if(typeof google == "undefined" || typeof google.maps == "undefined"){

        console.log("Google maps JavaScript needs to be loaded.");


        if(me.connectivity.isOnline()){
            console.log("online, loading map");

            //Load the SDK
            window.mapInit = function(){
                me.initMap(option);
                me.enableMap();
            }

            let script = document.createElement("script");
            script.id = "googleMaps";

            if(me.apiKey){
                script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&callback=mapInit';
            } else {
                script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
            }

            document.body.appendChild(script);

        }
        else {
          me.disableMap();
        }
    }
    else {

        if(me.connectivity.isOnline()){
            console.log("showing map");
            me.initMap(option);
            me.enableMap();
        }
        else {
            console.log("disabling map");
            me.disableMap();
        }

    }

  }

  initMap(options){

    console.log(options);

    var me = this;

    me.fromId = options.fromId;
    me.toId = options.toId;

    // me.latlng1 = options.jeep_1;
    // me.points1 = options.marker_1;

    me.ctr1=options.ctr1;
    me.ctr2=options.ctr2;
    me.ctr3=options.ctr3;
    me.ctr4=options.ctr4;

    // console.log(ctr2);
    // console.log(options.jeep_2!==undefined);


    me.latlng1 = options.jeep_1;
    me.points1 = options.marker_1;
    // console.log(options.jeep_2!==undefined);
    // console.log(options.jeep_2);
    // console.log(options.jeep_3);
    if(me.ctr1==='1ride'&&(me.ctr2==='forth'||me.ctr2==='back')){
        // console.log(options.end1);
        me.end1Ctr = options.end1;
        // console.log(end1Ctr);
        me.points2 = options.marker_2;
    }

    else if (options.jeep_2!==undefined) {
        // console.log('not undefined');
        me.latlng2 = options.jeep_2;
        // console.log(latlng2);
        me.points2 = options.marker_2;
        me.end1Ctr = options.end1;
        me.end2Ctr = options.end2;
        if(options.jeep_3!==undefined){
          // console.log('jeep3 not unde');
            me.latlng3 = options.jeep_3;
            me.points3 = options.marker_3;
            me.end1Ctr = options.end1;
            me.end2Ctr = options.end2;
            me.end3Ctr = options.end3;
        }
        else {
            // console.log('jeep3 undefined');
            me.latlng3 = undefined;
            me.points3 = undefined;
            me.end3Ctr = null;
        }
        if(options.jeep_4!==undefined){
          // console.log('jeep4 not unde');
            me.latlng4 = options.jeep_4;
            me.points4 = options.marker_4;
            me.end1Ctr = options.end1;
            me.end2Ctr = options.end2;
            me.end3Ctr = options.end3;
            me.end4Ctr = options.end4;
            // console.log('aa');
            // console.log(end4Ctr);
        }
        else {
            // console.log('jeep4 undefined');
            me.latlng4 = undefined;
            me.points4 = undefined;
            me.end4Ctr = null;
        }
    }
    else {
        me.latlng2 = undefined;
        me.points2 = undefined;
        me.end1Ctr = null;
        me.end2Ctr = null;


    }

    me.mapInitialised = true;

    navigator.geolocation.getCurrentPosition(

        (position) => {
            let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            let mapOptions = {
                // center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                streetViewControl: false,
                mapTypeControl: false
            }
            console.log('map');
            console.log(document.getElementById("map"));
            // me.map = new google.maps.Map(document.getElementById("map"), mapOptions);
            if (me.latlng2!==undefined&&me.ctr1!==undefined&&me.ctr2!==undefined) {
                console.log('map3');
                me.map = new google.maps.Map(document.getElementById('map2'), mapOptions);

            }
            else if (me.ctr1==='1ride'&&(me.ctr2==='forth'||me.ctr2==='back')&&me.latlng2===undefined) {
                console.log('map2');
                me.map = new google.maps.Map(document.getElementById('map2'), mapOptions);

            }
            else if (me.latlng1!==undefined&&me.ctr1===undefined&&me.ctr2===undefined){
                console.log('map1');
                me.map = new google.maps.Map(document.getElementById('map1'), mapOptions);

            }
            // console.log(me.latlng2);
            me.color1 = me.setColor(me.latlng1.color);
            if(me.latlng2!==undefined){
              me.color2 = me.setColor(me.latlng2.color);
            }
            // if(me.latlng3!== null){
            //   me.color3 = me.setColor(me.latlng3.color);
            // }
            // if(me.latlng4!==null){
            //   me.color4 = me.setColor(me.latlng4.color);
            // }

            // Symbol that gets animated along the polyline
            me.lineSymbol1 = {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 5,
              strokeColor: me.color1,
            };

            // Symbol that gets animated along the polyline
            me.lineSymbol2 = {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 5,
                strokeColor: me.color2,
            };
            // Symbol that gets animated along the polyline
            me.lineSymbol3 = {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 5,
                strokeColor: me.color3,
            };
            // Symbol that gets animated along the polyline
            me.lineSymbol4 = {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 5,
                strokeColor: me.color4,
            };

            // Create the DIV to hold the control and call the CenterControl()
            // constructor passing in this DIV.
            var centerControlDiv = document.createElement('div');

            var colorCodeDiv = document.createElement('div');
            colorCodeDiv.style.border = '2px solid #fff';
            colorCodeDiv.style.boxShadow = '0 1px 4px -1px rgba(0,0,0,.3)';
            colorCodeDiv.style.padding='10px';
            colorCodeDiv.style.backgroundColor = 'rgb(255, 255, 255)';
            colorCodeDiv.style.maxWidth='100%';
            colorCodeDiv.style.width='100%';

            if (me.latlng2 !==undefined || me.ctr1==='1ride') {
              var divRow1 = document.createElement('div');
              divRow1.className='row';
              divRow1.style.padding='0px';
              colorCodeDiv.appendChild(divRow1);

              var divCol1 = document.createElement('div');
              divCol1.className='col col-100';
              var from = me.fromId;
              var to = me.toId;

              var index = {};

              // $translate(from).then(function(title1) {
                  index.from=from;
              //     return $translate(to);
              // }).then(function(title2) {
                  index.to=to;
                  divCol1.innerHTML = index.from+" - "+index.to;
              // });

              console.log(index);
              divCol1.style.backgroundColor = 'rgb(255, 255, 255)';
              divCol1.style.maxWidth='100%';
              divCol1.style.cursor = 'pointer';
              divCol1.style.textAlign = 'center';
              divCol1.style.fontWeight = 'bold';
              divRow1.appendChild(divCol1);


            }


            var colorHead;
            if (me.latlng2 !==undefined){
                colorHead='Legends:';
            }
            else{
                colorHead='Legend:';
            }

            var divRow2 = document.createElement('div');
            divRow2.className='row';
            divRow2.style.padding='0px';
            colorCodeDiv.appendChild(divRow2);



            var divCol2 = document.createElement('div');
            divCol2.className='col col-100';

            // $translate(colorHead).then(function(title) {
                divCol2.innerHTML=colorHead;
            // });
            divCol2.id="title";
            divCol2.style.backgroundColor = 'rgb(255, 255, 255)';
            divCol2.style.maxWidth='100%';
            divCol2.style.cursor = 'pointer';
            divCol2.style.textAlign = 'center';
            divCol2.style.fontWeight = 'bold';
            divRow2.appendChild(divCol2);



            // var colorCode1b = me.setColorCode(colorCodeDiv,this.map,this.latlng1.color,this.latlng1.name)

            colorCodeDiv.index = 1;
            me.map.controls[google.maps.ControlPosition.TOP_CENTER].push(colorCodeDiv);

            google.maps.event.addListenerOnce(me.map, 'idle', function(){

              if (me.latlng2!==undefined&&me.ctr1!==undefined&&me.ctr2!==undefined) {

                  // console.log('enter latlang2');
                  // console.log(latlng2.coordi);
                var a = me.getStartEnd(me.latlng1.coordi,'jeep1');
                var b = me.getStartEnd(me.latlng2.coordi,'jeep2');
                if (me.latlng3 !==undefined){
                  console.log('jeep3');
                    var c = getStartEnd(me.latlng3.coordi,'jeep3');
                }
                if (me.latlng4 !==undefined){
                  console.log('jeep4');
                    var d = getStartEnd(me.latlng4.coordi,'jeep4');
                }

                var colorCode1b = me.setColorCode(colorCodeDiv,me.map,me.color1,me.latlng1.name);
                if (me.start_new2!==undefined) {
                    var colorCode2b = me.setColorCode(colorCodeDiv,me.map,me.color2,me.latlng2.name);
                }

                if(me.latlng3 !==undefined){
                    var colorCode3b = me.setColorCode(colorCodeDiv,me.map,me.color3,me.latlng3.name);
                }

                if(me.latlng4 !==undefined){
                    var colorCode4b = me.setColorCode(colorCodeDiv,me.map,me.color4,me.latlng4.name);
                }
                me.bendAndSnap(me.start_new1,'jeep1');
                console.log('bend1');
                if(me.start_new2!==undefined){
                  me.bendAndSnap(me.start_new2,'jeep2');
                  console.log('bend2');
                }
                console.log(me.start_new3);
                if(me.start_new3!==undefined){
                  console.log('bend 3');
                  console.log(me.start_new3);
                  me.bendAndSnap(me.start_new3,'jeep3');
                }
                if(me.start_new4!==undefined){
                  console.log('bend 4');
                  console.log(me.start_new4);
                  me.bendAndSnap(me.start_new4,'jeep4');
                }
              }
              else if (me.ctr1==='1ride'&&(me.ctr2==='forth'||me.ctr2==='back')&&me.latlng2===undefined){
                  var colorCode1bif = new setColorCode(colorCodeDiv,map,color1,me.latlng1.name);
                  var ride = getStartEnd(latlng1.coordi,'jeep1');
                  // console.log(latlng1.coordi);
                  console.log('1ride if');
                  // console.log(start_new1);
                  me.bendAndSnap(me.start_new1,'jeep1');
              }
              else{
                console.log('this.latlng1.name');
                console.log(me.latlng1);
                  var colorCode1a = me.setColorCode(colorCodeDiv,me.map,me.color1,me.latlng1.name);
                  me.bendAndSnap(me.latlng1.coordi,'jeep1');

              }

              // if(me.latlng1!==null){
              //   console.log('elsee');
              //
              //   console.log(me.latlng1.coordi);
              //   me.bendAndSnap(me.latlng1.coordi,'jeep1');
              //
              // }
              //
              // if(me.latlng1!==null){
              //     console.log('klk');
              //   console.log(me.points1);
              //   var point = me.points1;
              //
              //   me.loadMarkers(point,null);
              // }

              if(me.points1 !==undefined && me.points2 !==undefined && me.points3 === undefined){
                me.loadMarkers(me.points1,me.points2);

                console.log('loadmarkers2');
              }
              else if(me.points1 !==undefined && me.points2 !==undefined && me.points3 !== undefined && me.points4 === undefined){
                me.loadMarkers(me.points1,vpoints3);

                console.log('loadmarkers3');
              }
              else if(me.points1 !==undefined && me.points2 !==undefined && me.points3 !== undefined && me.points4 !== undefined){
                me.loadMarkers(me.points1,me.points4);

                console.log('loadmarkers4');
              }
              else if (me.ctr1==='1ride'&&(me.ctr2==='forth'||me.ctr2==='back')&&me.latlng2===undefined) {
                  console.log('1ride ctr');
                  me.loadMarkers(points1,null);
              }
              else{
                var point = me.points1;
                me.loadMarkers(point,null);
              }

              me.enableMap();

            });
        },

        (error) => {
            console.log(error);
        });

  }

  disableMap(){

    console.log("disable map");
  }

  enableMap(){

    console.log("enable map");
  }

  addConnectivityListeners(){
    var me = this;

    var onOnline = function(){
        setTimeout(function(){
            if(typeof google == "undefined" || typeof google.maps == "undefined"){
                me.loadGoogleMaps();
            } else {
                if(!me.mapInitialised){
                    me.initMap(option);
                }

                me.enableMap();
            }
        }, 2000);
    };

    var onOffline = function(){
        me.disableMap();
    };

    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);

  }

  setColor(color){
    switch(color) {
      case 'Lavander':
        return '#8A2BE2';
      case 'Suntan':
        return '#FFFF99';
      case 'Orange':
        return '#FF4500';
      case 'Fire Red':
        return 'maroon';
      default:
        return color;
    }
  }

  setColorCode(controlDiv, map,color,jname) {
    var divRow = document.createElement('div');
    divRow.style.backgroundColor = 'rgb(255, 255, 255)';
    divRow.style.maxWidth='100%';
    divRow.style.width='100%';
    divRow.style.textAlign = 'center';
    divRow.className='row';
    controlDiv.appendChild(divRow);

    var divCol = document.createElement('div');
    divCol.style.padding='0px';
    divCol.className='col';
    divRow.appendChild(divCol);

    var canvas = document.createElement('canvas');
    canvas.id = 'colorCanvas';
    canvas.style.height='10px';
    canvas.style.width='10px';

    if(color==='White'){
      canvas.style.border='1px solid #000000';
    }

    if(color==='#FFFF99'){
      canvas.style.border='1px solid #000000';
    }

    canvas.style.backgroundColor=color;
    divCol.appendChild(canvas);

    var text = document.createElement('span');
    text.innerHTML = ' '+jname;
    divCol.appendChild(text);

  }

  getStartEnd(startEnd,ctr){
    var me = this;
      // console.log(points1);
    if(ctr === 'jeep1'){
      console.log('enter from');
      var string1 = startEnd;
      me.lat_array_coords1 = string1.split("|");
      // console.log(end1Ctr);
      // console.log(lat_array_coords1);
      // console.log($stateParams.toId);
      // console.log(points1.lat+","+points1.lng);

      var startCtr1;
      var endCtr1;

      // if (ctr1==='1ride') {
      //   console.log('1ride iffff');
      //   startCtr1 = getStartPoints(end1Ctr,lat_array_coords1,ctr);
      //   endCtr1 = getEndPoints(points1.lat+","+points1.lng,lat_array_coords1,ctr);
      // }
      // else {
        startCtr1 = me.getStartPoints(me.points1.lat+","+me.points1.lng,me.lat_array_coords1,ctr);
        endCtr1 = me.getEndPoints(me.end1Ctr,me.lat_array_coords1,ctr);
      // }

      // console.log(me.points1.lat+","+me.points1.lng);
      // console.log(end1Ctr);
      // console.log(lat_array_coords1);
      //
      // console.log(startCtr1);
      // console.log(endCtr1);


      me.start_new1 = me.lat_array_coords1[startCtr1];
      // console.log(start_new1);
      // console.log(ctr1);
      // console.log(startCtr1>endCtr1);
      if (startCtr1>endCtr1) {
        // console.log('1a');
        // console.log((ctr1==='1ride'&&ctr2==='forth'));
        //   console.log(start_new1);
        for (var j = startCtr1-1; j >= endCtr1; j--) {
            me.start_new1 += "|"+me.lat_array_coords1[j];
        }
        if (ctr1==='1ride') {
          console.log('reverse');
          me.start_new1 = me.start_new1.split("|").reverse().join("|");
        }
        console.log(me.start_new1);

      }
      else {
        console.log('2a');
          for (var i = startCtr1+1; i <= endCtr1; i++) {
              me.start_new1 += "|"+me.lat_array_coords1[i];
          }
          // if (ctr1==='1ride'&&ctr2==='back'&&(latlng1.name!=='CHECK-POINT-HOLY'||latlng1.name!=='CHECK-POINT-HOLY-HI-WAY'||latlng1.name!=='MARISOL-PAMPANG'||latlng1.name!=='PANDAN-PAMPANG')) {
          //   console.log('rev2');
          //   start_new1.split("|").reverse().join("|");
          // }


      }
      console.log(me.start_new1);
    }
    if(ctr === 'jeep2'){
      console.log('enter from');
      // console.log(points2);
      var string2 = startEnd;
      me.lat_array_coords2 = string2.split("|");

      console.log(me.points2.lat+","+me.points2.lng);
      // console.log(end2Ctr);
      console.log(me.lat_array_coords2);
      var startCtr2 = me.getStartPoints(me.points2.lat+","+me.points2.lng,me.lat_array_coords2,ctr);
      var endCtr2 = me.getEndPoints(me.end2Ctr,me.lat_array_coords2,ctr);

      console.log('jepp2');
      // console.log(startCtr2);
      // console.log(endCtr2);
      me.start_new2 = me.lat_array_coords2[startCtr2];
      console.log(me.start_new2);
      // console.log(ctr2);
    //   if (ctr2=='forth') {
    //       console.log('enter ctr2');

        if (startCtr2>endCtr2) {
          console.log('123');
            for (var l = startCtr2-1; l >= endCtr2; l--) {
                me.start_new2 += "|"+me.lat_array_coords2[l];
            }
            me.start_new2 = me.start_new2.split("|").reverse().join("|");
        }
        else {
          console.log('456');
            for (var k = startCtr2+1; k <= endCtr2; k++) {
                me.start_new2 += "|"+me.lat_array_coords2[k];
                console.log(me.start_new2);
            }

        }
        console.log(me.start_new2);




      }
      if(ctr === 'jeep3'){
        // console.log('enter mid3');
        // console.log(points3);
        var string3 = startEnd;
        lat_array_coords3 = string3.split("|");

        // console.log(points3.lat+","+points3.lng);
        // console.log(end3Ctr);
        // console.log(lat_array_coords3);
        var startCtr3 = me.getStartPoints(me.points3.lat+","+me.points3.lng,vlat_array_coords3,ctr);
        var endCtr3 = me.getEndPoints(me.end3Ctr,me.lat_array_coords3,ctr);
        // console.log(startCtr3);
        // console.log(endCtr3);
        //

        me.start_new3 = me.lat_array_coords3[startCtr3];
        // console.log(start_new3);
        if (startCtr3<endCtr3 && start_new3!==undefined) {
          console.log('enter 3if1');
          for (var m = startCtr3+1; m <= endCtr3; m++) {
              me.start_new3 += "|"+me.lat_array_coords3[m];
          }
          // start_new3 = start_new3.split("|").reverse().join("|");
          console.log(me.start_new3);
        }
        else if (startCtr3>endCtr3 && start_new3!==undefined){
          console.log('enter 3if3');
          for (var n = startCtr3-1; n >= endCtr3; n--) {
              me.start_new3 += "|"+me.lat_array_coords3[n];
          }
          me.start_new3 = me.start_new3.split("|").reverse().join("|");

          // console.log('33a');
          console.log(me.start_new3);
        }
      }
      if(ctr === 'jeep4'){
        // console.log('enter mid4');
        // console.log(points4);
        var string4 = startEnd;
        me.lat_array_coords4 = string4.split("|");

        // console.log(points4.lat+","+points4.lng);
        // console.log(end4Ctr);
        // console.log(lat_array_coords4);
        var startCtr4 = me.getStartPoints(vpoints4.lat+","+me.points4.lng,me.lat_array_coords4,ctr);
        var endCtr4 = me.getEndPoints(me.end4Ctr,me.lat_array_coords4,ctr);
        // console.log(startCtr4);
        // console.log(endCtr4);


        me.start_new4 = me.lat_array_coords4[startCtr4];

        if (startCtr4<endCtr4 && start_new4!==undefined) {
          console.log('enter 4if1');
          for (var m = startCtr4+1; m <= endCtr4; m++) {
              me.start_new4 += "|"+me.lat_array_coords4[m];
          }
          // start_new4 = start_new4.split("|").reverse().join("|");
          console.log(me.start_new4);
        }
        else if (startCtr4>endCtr4 && start_new4!==undefined){
          console.log('enter 4if4');
          for (var n = startCtr4-1; n >= endCtr4; n--) {
              me.start_new4 += "|"+me.lat_array_coords4[n];
          }
          me.start_new4 = me.start_new4.split("|").reverse().join("|");


          console.log(me.start_new4);
        }
        console.log('ccc');
        console.log(me.start_new4);
      }


  }

  //match the selected start point to the start point array
  getStartPoints(startpoint,ctr,jeepNo){
    var me = this;
    // console.log(ctr1);
    // console.log(ctr2);
    // console.log(jeepNo);
    // console.log((ctr2==='forth'||ctr2==='back'));
    // if (latlng3===undefined) {
      console.log('undefined');
      // console.log(ctr1);
      // console.log(ctr2);
      if ((me.ctr1=='1ride'&&me.ctr2=='forth'&&jeepNo==='jeep1')||(me.ctr1=='forth'&&jeepNo==='jeep1')||(me.ctr2=='forth'&&jeepNo==='jeep2')||(me.ctr3=='forth'&&jeepNo==='jeep3')||(me.ctr4=='forth'&&jeepNo==='jeep4')) {
        console.log('start index of');
        console.log(ctr.indexOf(startpoint));
        return ctr.indexOf(startpoint);
      }
      else if((me.ctr1=='1ride'&&me.ctr2=='back'&&jeepNo==='jeep1')||(me.ctr1=='back'&&jeepNo==='jeep1')||(me.ctr2=='back'&&jeepNo==='jeep2')||(me.ctr3=='back'&&jeepNo==='jeep3')||(ctr4=='back'&&jeepNo==='jeep4')){

        console.log('lat3 unde');
          console.log('start last index');
          // console.log(ctr);
          // console.log(startpoint);
          // console.log(ctr.lastIndexOf(startpoint));
          return ctr.lastIndexOf(startpoint);
      }
  }

  //match the selected end point to the end point array
  getEndPoints(endpoint,ctr,jeepNo){
    var me = this;

    // console.log(endpoint);
    // console.log(ctr);
    // console.log(ctr1);
    // console.log(ctr1=='back'||ctr2=='back'||ctr3=='back');
    // console.log(ctr1=='forth'||ctr2=='forth'||ctr3=='forth');

    // if (latlng3===undefined) {
      if((me.ctr1=='1ride'&&me.ctr2=='forth'&&jeepNo==='jeep1')||(me.ctr1=='forth'&&jeepNo==='jeep1')||(me.ctr2=='forth'&&jeepNo==='jeep2')||(me.ctr3=='forth'&&jeepNo==='jeep3')||(me.ctr4=='forth'&&jeepNo==='jeep4')) {
        console.log('end index of');
        console.log(ctr.indexOf(endpoint));
        return ctr.indexOf(endpoint);
      }
      if((me.ctr1=='1ride'&&me.ctr2=='back'&&jeepNo==='jeep1')||(me.ctr1=='back'&&jeepNo==='jeep1')||(me.ctr2=='back'&&jeepNo==='jeep2')||(me.ctr3=='back'&&jeepNo==='jeep3')||(me.ctr4=='back'&&jeepNo==='jeep4')){
          console.log('end last index');
          console.log(me.ctr);
          console.log(endpoint);
          console.log(ctr.lastIndexOf(endpoint));
          console.log(ctr.lastIndexOf(endpoint));
          return ctr.lastIndexOf(endpoint);
      }
    // }
    // else if (latlng3!==undefined) {
      // if ((ctr1=='1ride'&&ctr2=='forth'&&jeepNo==='jeep1')||(ctr1=='forth'&&jeepNo==='jeep1')||(ctr2=='forth'&&jeepNo==='jeep2')||(ctr3=='forth'&&jeepNo==='jeep3')) {
      //   console.log('end last index');
      //   console.log(ctr);
      //   console.log(endpoint);
      //   console.log(ctr.lastIndexOf(endpoint));
      //   console.log(ctr.lastIndexOf(endpoint));
      //   return ctr.lastIndexOf(endpoint);
      // }
      // else if((ctr1=='1ride'&&ctr2=='back'&&jeepNo==='jeep1')||(ctr1=='back'&&jeepNo==='jeep1')||(ctr2=='back'&&jeepNo==='jeep2')||(ctr3=='back'&&jeepNo==='jeep3')){
      //   console.log('end index of');
      //   console.log(ctr.indexOf(endpoint));
      //   return ctr.indexOf(endpoint);
      // }
    // }


  }

  bendAndSnap(latlngs,ctr) {
    var me = this;

    me.coords = latlngs;

    //set url params
    let params = new URLSearchParams();
    params.set('interpolate', true);
    params.set('key', me.apiKey);
    params.set('path', me.coords);

    me.http.get('https://roads.googleapis.com/v1/snapToRoads',{search: params})
    .subscribe(
      data => {
        // if(ctr == 'jeep1'){
        //   me.processSnapToRoadResponse(data.json(),'jeep1');
        //   me.drawSnappedPolyline(me.snappedCoordinates1,'jeep1');
        // }
        //
        // else {
        //   me.processSnapToRoadResponse(data.json(),null);
        //   me.drawSnappedPolyline(me.snappedCoordinates1,null);
        // }

        if(ctr == 'jeep1'){
          console.log(data.json());
          console.log('jeep1 bend');
          me.processSnapToRoadResponse(data.json(),'jeep1');
          me.drawSnappedPolyline(me.snappedCoordinates1,'jeep1');
        }

        if(ctr=='jeep2'){
          // console.log(response.data);
          // console.log('enter to');
          console.log('jeep 2 bend');
          console.log(data.json());
          me.processSnapToRoadResponse(data.json(),'jeep2');
          me.drawSnappedPolyline(me.snappedCoordinates2,'jeep2');
        }


        // if(ctr=='jeep3'){
        //   // console.log(response.data);
        //   // console.log('enter mid');
        //   me.processSnapToRoadResponse(data.json(),'jeep3');
        //   me.drawSnappedPolyline(me.snappedCoordinates3,'jeep3');
        // }
        //
        //
        // if(ctr=='jeep4'){
        //   // console.log(response.data);
        //   // console.log('enter 4');
        //   me.processSnapToRoadResponse(data.json(),'jeep4');
        //   me.drawSnappedPolyline(me.snappedCoordinates4,'jeep4');
        // }

        else {
            console.log('default');
          me.processSnapToRoadResponse(data.json(),null);
          me.drawSnappedPolyline(me.snappedCoordinates1,null);
        }

        me.fitBounds(me.markers);

      },
      err => console.log(err)
    );

  }

  // Parse response from snapToRoads API request
  // Store all coordinates in response
  // Calls functions to add markers to map for unsnapped coordinates
  processSnapToRoadResponse(data,ctr) {
    var me = this;
    var originalIndexes = [];
    me.snappedCoordinates1 = [];
    var originalIndexes2 = [];
    me.snappedCoordinates2 = [];
    var originalIndexes3 = [];
    me.snappedCoordinates3 = [];
    var originalIndexes4 = [];
    me.snappedCoordinates4 = [];
    if(ctr == 'jeep1'){
      console.log('process from');
      for (var i = 0; i < data.snappedPoints.length; i++) {
        var latlng1 = {
          'lat': data.snappedPoints[i].location.latitude,
          'lng': data.snappedPoints[i].location.longitude
        };
        var interpolated1 = true;

        if (data.snappedPoints[i].originalIndex !== undefined) {
          interpolated1 = false;
          originalIndexes.push(data.snappedPoints[i].originalIndex);
          latlng1.originalIndex = data.snappedPoints[i].originalIndex;
        }

        latlng1.interpolated = interpolated1;
        me.snappedCoordinates1.push(latlng1);
      }
    }
    if(ctr=='jeep2'){
      console.log('process to');
      for (var j = 0; j < data.snappedPoints.length; j++) {
        var latlng2 = {
          'lat': data.snappedPoints[j].location.latitude,
          'lng': data.snappedPoints[j].location.longitude
        };
        var interpolated2 = true;

        if (data.snappedPoints[j].originalIndex !== undefined) {
          interpolated2 = false;
          originalIndexes.push(data.snappedPoints[j].originalIndex);
          latlng2.originalIndex = data.snappedPoints[j].originalIndex;
        }

        latlng2.interpolated = interpolated2;
        me.snappedCoordinates2.push(latlng2);
      }
    }
    if(ctr=='jeep3'){
      console.log('process to');
      for (var k = 0; k < data.snappedPoints.length; k++) {
        var latlng3 = {
          'lat': data.snappedPoints[k].location.latitude,
          'lng': data.snappedPoints[k].location.longitude
        };
        var interpolated3 = true;

        if (data.snappedPoints[k].originalIndex !== undefined) {
          interpolated3 = false;
          originalIndexes.push(data.snappedPoints[k].originalIndex);
          latlng3.originalIndex = data.snappedPoints[k].originalIndex;
        }

        latlng3.interpolated = interpolated3;
        me.snappedCoordinates3.push(latlng3);
      }
    }
    if(ctr=='jeep4'){
      console.log('process to');
      for (var l = 0; l < data.snappedPoints.length; l++) {
        var latlng4 = {
          'lat': data.snappedPoints[l].location.latitude,
          'lng': data.snappedPoints[l].location.longitude
        };
        var interpolated4 = true;

        if (data.snappedPoints[l].originalIndex !== undefined) {
          interpolated4 = false;
          originalIndexes.push(data.snappedPoints[l].originalIndex);
          latlng4.originalIndex = data.snappedPoints[l].originalIndex;
        }

        latlng4.interpolated = interpolated4;
        me.snappedCoordinates4.push(latlng4);
        console.log(me.snappedCoordinates4);
      }
    }

  }

  // Draw the polyline for the snapToRoads API response
  drawSnappedPolyline(snappedCoords,ctr) {

    var me = this;

    if(ctr =='jeep1'){
        console.log(snappedCoords);
      me.snappedPolyline1 = new google.maps.Polyline({
        path: snappedCoords,
        strokeColor: 'turquoise',
        strokeWeight: 5,
        icons: [{
          icon: me.lineSymbol1,
          offset: '100%'
        }]
      });

      me.snappedPolyline1.setMap(me.map);
      me.animateCircle(me.snappedPolyline1);

      me.polylines1.push(me.snappedPolyline1);
      console.log(me.polylines1);
      console.log('draw from');
    }
    if(ctr=='jeep2'){
      console.log('draw to');
      console.log(snappedCoords);
      me.snappedPolyline2 = new google.maps.Polyline({
        path: snappedCoords,
        strokeColor: '#FF69B4',
        strokeWeight: 5,
        icons: [{
          icon: me.lineSymbol2,
          offset: '100%'
        }]
      });

      me.snappedPolyline2.setMap(me.map);
      me.animateCircle(me.snappedPolyline2);

      me.polylines2.push(me.snappedPolyline2);
      console.log(me.polylines2);
    }

    for (var i = 0; i < snappedCoords.length; i++) {
      var marker = me.addMarker(snappedCoords[i]);
    }




  }

  //add marker for fitBounds()
  addMarker(coords,ctr) {
    var me = this;
    var marker = new google.maps.Marker({
      position: coords,
      map: me.map,
    });
    marker.setMap(null);
    me.markers.push(marker);

    return marker;
  }

  //load markers for the landmarks
  loadMarkers(points,points2){

    var me = this;
    var records;

    if (points2!==null) {
      records = [{lat:points.lat,lng:points.lng,text:points.text},{lat:points2.lat,lng:points2.lng,text:points2.text}];
    }
    else {
      records = points;
    }

      console.log(records);

      for (var x = 0; x < records.length; x++) {
        var markerPos = new google.maps.LatLng(records[x].lat,records[x].lng);
        var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
        var marker = new google.maps.Marker({
            map: me.map,
            animation: google.maps.Animation.DROP,
            position: markerPos,
            icon: iconBase + 'schools_maps.png'
        });
        var infoWindowContent;
        if (points2!==null) {
          infoWindowContent = records[x].text;
          me.addInfoWindow(marker, infoWindowContent);
        }
        else{
          infoWindowContent = points[x].text;
          me.addInfoWindow(marker, infoWindowContent);
        }
      }




  }

  //display info about the markers
  addInfoWindow(marker, message) {
    var me = this;
    var point_title = "<h4>"+message+"</h4>";
    var infoWindow = new google.maps.InfoWindow({
        content: point_title
    });
    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open(me.map, marker);
    });

  }

  //Animate an icon along a polyline
  animateCircle(polyline) {
    var me = this;
    var count = 0;
    var defaultIcon = [
      {
        icon: me.lineSymbol1,
        offset: '100%'
      }
    ];

    window.setInterval(function() {
      count = (count + 0.7) % 200;
      var icons = polyline.get('icons') || defaultIcon;
      icons[0].offset = (count / 2) + '%';
      polyline.set('icons', icons);
    }, 20);
  }

  //Fit the map bounds to the current set of markers
  fitBounds(markers) {
    var me = this;
    console.log('Fit');
    console.log(me.map);
    console.log(markers);
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
      bounds.extend(markers[i].getPosition());
    }
    me.map.fitBounds(bounds);
  }

  disableMap(){
    console.log("disable map");
    let alert = Alert.create({
      title: 'No connection',
      subTitle: 'Looks like there is a problem with your network connection. Try again later.',
      buttons: [{
        text: 'OK',
        handler: data => {
          this.nav.pop();
        }
      }]
    });
    this.nav.present(alert);
  }

  enableMap(){
    console.log("enable map");
  }

  addConnectivityListeners(){
    var me = this;
    console.log('conn');console.log(!me.mapInitialised);

    var onOnline = function(){
        setTimeout(function(){
            if(typeof google == "undefined" || typeof google.maps == "undefined"){
                me.loadGoogleMaps();
            } else {
                if(!me.mapInitialised){
                  console.log('init');
                    me.initMap(option);
                }

                me.enableMap();
            }
        }, 2000);
    };

    var onOffline = function(){

        me.disableMap();
    };

    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);

  }


  check_marks(tags,name){
    console.log('mappu'+document.getElementById('map'));



    var stringTags = tags;
    var index = stringTags.split(",");

    if (index.indexOf(name)!=-1) {
      return true;
    }
  }
}
