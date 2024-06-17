sap.ui.define(['sap/ui/core/mvc/ControllerExtension','sap/ui/model/json/JSONModel','sap/m/MessageToast','sap/base/security/URLWhitelist','sap/ui/core/message/Message', 'sap/ui/core/message/MessageType'], function (ControllerExtension,JSONModel,MessageToast,URLWhitelist,Message, MessageType) {
	'use strict';

	return ControllerExtension.extend('freightordermgt.ext.controller.FoController', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		pDialog : null,
		pdf_content: null,
		uploadfiles: function() {
			if (!this.pDialog) { 	
				this.base.getExtensionAPI().loadFragment({
					name: "freightordermgt.ext.fragment.fileselector"
				}).then(function(oDialog){
					// oDialog.open();
					this.pDialog = oDialog;
					oDialog = null;
					this.pDialog.open();
				 var oFileUploader = this.pDialog.getContent('uploadSet')[0];
				 if(oFileUploader){
					oFileUploader.removeAllItems();
				 }				
				}.bind(this)).catch(error=>{alert(error.message)})
			}else{
				var oFileUploader =  this.pDialog.getContent('uploadSet')[0];
				if(oFileUploader){
				   oFileUploader.removeAllItems();
				}
				this.pDialog.open();

			}
		
		},
		showPdf: function(oEvent){
			let showPdf = null;
			var oModel = this.base.getExtensionAPI().getModel();
		   //  var sPath = oModel.getBindings()[0].getContext().sPath;
		   var fileRep =  oModel.getBindings().filter(bn=>{ return bn.sPath=='Repositoryid' })[0].vValue
		   var fileObj =  oModel.getBindings().filter(bn=>{ return bn.sPath=='Fileobjectid' })[0].vValue

			const sFunctionname = "com.sap.gateway.srvd.zfreightorder_service.v0001.downloadfile";
			var sPath = this.getView().getBindingContext().getPath();
			const oFunction = oModel.bindContext(`${sPath}/${sFunctionname}(...)`);
	
		   oFunction.execute().then(function(){
			const oContext = oFunction.getBoundContext();
			var filename = oContext.getProperty('FILENAME');
			var stream = oContext.getProperty('STREAM');
			 stream = stream.replaceAll('_','/').replaceAll('-','+');
			 const deccont = atob(stream);			
			const byteNumbers = new Array(deccont.length);
			for (let i = 0; i < deccont.length; i++) {
				byteNumbers[i] = deccont.charCodeAt(i);
			}
			const byteArray = new Uint8Array(byteNumbers);
			var blob = new Blob([byteArray],{type: "application/pdf"});
			const pdfurl = URL.createObjectURL(blob);
			let oPdfmodel = new JSONModel({
				Source: pdfurl,
				Title: filename,
				Height: "1000px"
			});
			URLWhitelist.add("blob");
			this.getView().setModel(oPdfmodel,"pdf");
		}.bind(this)).catch(err=>{
				console.log('function err happened');
				console.log(err);
			});

			if (fileRep){
				showPdf = true ;
			}else{
				showPdf = false;
			};
 
			let oPdfview = new JSONModel({
				Viewshow: showPdf
			});
			 this.getView().setModel(oPdfview,"pdfview");	

		},
		onUploadSet:  function(oEvent) {
			var oFileUploader = this.pDialog.getContent('uploadSet')[0];
			var oFile = oFileUploader.getItems()[0].getFileObject();
			var sFileName = oFile.name;
			var iFileLen = oFile.size;
			var sFileType = oFile.type;
			// console.log(this.pdf_content);
			const oExtensionAPI = this.base.getExtensionAPI();
			// var view1 = this.getView();
			var oModel = oExtensionAPI.getModel();
			const sFunctionname = "com.sap.gateway.srvd.zfreightorder_service.v0001.uploadfile";
			var sPath = this.getView().getBindingContext().getPath();

			// let sRaw = String.raw`${this.pdf_content}`;
			
			let sMimtype = sFileName.split(".")[sFileName.split(".").length-1];

			

			const oFunction = oModel.bindContext(`${sPath}/${sFunctionname}(...)`);
			oFunction.setParameter("filename",sFileName);
			oFunction.setParameter("mimetype",sMimtype);
			var content = btoa(this.pdf_content);

			oFunction.setParameter("attachment",content); 
		   oFunction.execute().then(result=>{
			MessageToast.show("File Uploaded into BTP CMIS!");
			// console.log(result);
			// this.pDialog.close();
		}).catch(err=>{
			console.log(err);
		   }).finally(this.pDialog.close());
			
	
			  /* TODO:Call to OData */
		  },
		  onCloseDialog: function (oEvent) {        
			// alert("close clicked");   
			  this.pDialog.close();
		  },
		  onItemRemoved:function (oEvent) {
            console.log("File Remove/delete Event Fired!!!")  
            /* TODO: Clear the already read excel file data */          
        },
        onUploadSetComplete: function (oEvent) {

            var oFileUploader = this.pDialog.getContent('uploadSet')[0];
            var oFile = oFileUploader.getItems()[0].getFileObject();
            var reader = new FileReader();

            reader.onload = (e)=>{
                this.pdf_content = e.currentTarget.result;
                // console.log(this.pdf_content);
            }
			reader.readAsBinaryString(oFile);
            MessageToast.show("Upload Successful");

            /* TODO: Read excel file data*/
        },
        onItemRemoved:function (oEvent) {
            console.log("File Remove/delete Event Fired!!!")  
            /* TODO: Clear the already read excel file data */          
         },

		
		
		
		override: {
			/**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf freightordermgt.ext.controller.FoController
             */
			onInit: function () {
				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				var oModel = this.base.getExtensionAPI().getModel();
			},
			routing: {
				onAfterBinding: function (oBindingContext, mParameters) {
					var extensionAPI = this.base.getExtensionAPI(),
						messages = [
							new Message({
								message: "onAfterBinding: Context bound",
								type: MessageType.Information
							})
						];
					extensionAPI.showMessages(messages);
				}

			},

			onAfterRendering: function(){
				let oPdfview = new JSONModel({
					Viewshow: false
				});

				this.getView().setModel(oPdfview,"pdfview");


			}
		}
	});
});
