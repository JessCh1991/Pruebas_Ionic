import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx'; // Tutorial called for /ngx but that failed
import { DocumentViewer,DocumentViewerOptions   } from '@ionic-native/document-viewer/ngx';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  constructor(private platform:Platform, 
              private file:File,
              private ft:FileTransfer,
              private fo:FileOpener,
              private document:DocumentViewer
              ) { }
  

  ngOnInit() {

  }

  openPDF(){
    let filePath=this.file.applicationDirectory+"www/assets";
    if (this.platform.is('android')) {
      let fakeName = Date.now();
      this.file.copyFile(filePath,'rent.pdf',this.file.applicationDirectory ,`${fakeName}.pdf`).then(res=>{
        this.fo.open(res.nativeURL,'application/pdf');
      });
    }else{
      const options:DocumentViewerOptions={
        title:'My PDF'
      }
      this.document.viewDocument(`${filePath}/rent.pdf`,'application/pdf',options);
    }
  }


  downloadAndOpenPDF(){
    let dowloandURL="http://sysandweb.com/SysAndWeb/wp-content/themes/principal/downloads/Brochure-ERP.pdf";
    let path = this.file.applicationDirectory;
    const transfer = this.ft.create();

    transfer.download(dowloandURL,`${path}myfile.pdf`).then(entry =>{
      let url= entry.toURL();
      url=url.replace("file://","file://");
      if (this.platform.is('ios')) {
        this.document.viewDocument(url,'application/pdf',{});
      }else{
        this.fo.open(url,'application/pdf');
      }
    });
  }

  openRemoteFileByUrl(){
    const content_type='application/pdf';
    const fileUrl="http://sysandweb.com/SysAndWeb/wp-content/themes/principal/downloads/Brochure-ERP.pdf";
    const transfer = this.ft.create();
    let path = null;
    if (this.platform.is('ios')) {
      path = this.file.documentsDirectory;
    } else if (this.platform.is('android')) {
      path = this.file.dataDirectory;
    }
    transfer.download(fileUrl, path + 'myfile.pdf').then(entry => {
      let url = entry.toURL();
      //this.document.viewDocument(url, content_type, {});
      this.fo.open(url,content_type);
      this.fo.showOpenWithDialog(url,content_type);
    });
  }
}
