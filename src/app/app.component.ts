import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../environments/environment';
import { ElectronService, AppStore } from '@nsc/core';
import { initialData } from '@nsc/default-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  appStore = AppStore.Instance;

  constructor(private electronService: ElectronService) {
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
    }
  }

  ngOnInit(): void {
    if (this.appStore.getAllEpisodes().length === 0) {
      this.appStore.initData(initialData);
    }
  }
}
