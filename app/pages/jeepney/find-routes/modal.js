import {Page,Modal, NavController, ViewController,NavParams, Storage, SqlStorage} from 'ionic-angular';

import {DataService} from '../../../services/data';

@Page({
  templateUrl: 'build/pages/jeepney/find-routes/modal.html'
})

export class MyModal {
  static get parameters(){
    return [[ViewController],[DataService],[,NavParams]];
  }
  constructor(view,dataService,navParams) {

    this.navParams = navParams;

    this.ctr = navParams.get('ctrId');
    console.log('nacparams');
    console.log(this.ctr);

    //database service
    this.dataService = dataService;

    this.points = [];


    this.dataService.getPoints().then((data) => {
      console.log(data.result);
      if(data.res.rows.length > 0) {
        for(var i = 0; i < data.res.rows.length; i++) {
          this.points.push({name: data.res.rows.item(i).text});
        }
      }
      console.log(this.points);
    }, (error) => {
      console.log(error);
    })

    this.view = view;
  }

  close() {
    this.view.dismiss();
  }

  validateItem(ctr){
    let data = { 'point': ctr };
    this.view.dismiss(data);
    // console.log(ctr);
    // this.from = ctr;
    // alert(ctr);
  }
}
