window.onload = function() {
		var fileInput = document.getElementById('fileInput');
		var fileDisplayArea = document.getElementById('fileDisplayArea');

		fileInput.addEventListener('change', function(e) {
			
			$("#fileInput").hide();
			$("#restart").show();
			$(".dim").show();
			var file = fileInput.files[0];
			var textType = /text.*/;
			
			if (file.type.match(textType)) {
				var reader = new FileReader();

				reader.onload = function(e) {
					//fileDisplayArea.innerText = reader.result;
					var dataarray=csv2array(reader.result);
					var datasize=dataarray.length;
					//alert(datasize);

					var select_zoom;

					var read_campus=document.getElementById('select_campus').value;
					if(read_campus=="Vancouver")
					{
						//Vacouver Campus:
						//Map Center
						var LatiCenter=49.2629312;
						var LongiCenter=-123.2518267;
						//Diagonal Corner Long & Lati 
						var LatiMin=49.250000;
						var LatiMax=49.275000;
						var LongiMin=-123.265000;
						var LongiMax=-123.230000;

						select_zoom=15;
					}else{
						//Okanagan Campus:
						//Map Center
						var LatiCenter=49.940988;
						var LongiCenter=-119.396083;
						//Diagonal Corner Long & Lati
						var LatiMin=49.935478;
						var LatiMax=49.947087;
						var LongiMin=-119.403662;
						var LongiMax=-119.389217;
						select_zoom=16;
					}


					var map = new google.maps.Map(document.getElementById('map-canvas'), {
				        zoom: select_zoom,
				        center: new google.maps.LatLng(LatiCenter,LongiCenter),
				        mapTypeId: google.maps.MapTypeId.ROADMAP
				      });

					//Grid Step
					var grid_step=0.0003;
					
					//reading type
					var read_type=document.getElementById('select_type').value;
					//alert(read_type);

					//Reading Column
					var read_column=document.getElementById('select_column').value;
					//alert(read_column);

					var variance_min=0;
					var variance_max=0;

					for (i = LatiMin; i < LatiMax; i=i+grid_step) { 
						for (j = LongiMin; j < LongiMax; j=j+grid_step) { 
							
						    var lat1=i;
						    var long1=j;
						    var lat2=i+grid_step;
						    var long2=j+grid_step;

						    var quanlity=0;
						    var first=0;



						    for(k = 1; k < datasize; k=k+1){
						    	if((dataarray[k][18]>=lat1)&&(dataarray[k][18]<lat2)&&(dataarray[k][19]>=long1)&&(dataarray[k][19]<long2)) {
						    		quanlity=quanlity+1;
						    		
						    		first=first+Number(dataarray[k][read_column]);
						    	}
						    }

						    var myOpacity=0;
							var mean_first=0;

						    if(quanlity!=0)
						    {
								mean_first=first/quanlity;
								myOpacity=0.5;
								//alert(first+','+quanlity+','+mean_first);
						    }

						    var variance_first=0;


						    if(read_type=="Variance")
						    {
						    	//alert("variance!");

						    	for(k = 1; k < datasize; k=k+1){
							    	if((dataarray[k][18]>=lat1)&&(dataarray[k][18]<lat2)&&(dataarray[k][19]>=long1)&&(dataarray[k][19]<long2)) {
							    		variance_first=variance_first+Math.pow((Number(dataarray[k][read_column])-mean_first),2);
							    	}
						    	}

						    	if(quanlity!=0)
							    {
									variance_first=variance_first/quanlity;
									variance_first=Math.sqrt(variance_first);
									//有数值的格子才有透明度，否则不可见
									myOpacity=0.5;
									//alert(first+','+quanlity+','+mean_first);

									if(variance_min>variance_first)
									{
										variance_min=variance_first;
									}

									if(variance_max<variance_first)
									{
										variance_max=variance_first;
									}

							    }


								
								var color='#FFFFFF';
							    //alert(floor_mean_first);
							    
								if(variance_first<0.4){
									color='#0000FF';
								}else if(variance_first<0.8){
									color='#0033FF';
								}else if(variance_first<1.2){
									color='#0066FF';
								}else if(variance_first<1.6){
									color='#0099FF';
								}else if(variance_first<2){
									color='#00CCFF';
								}else if(variance_first<2.4){
									color='#FFFF00';
								}else if(variance_first<2.8){
									color='#FFCC00';
								}else if(variance_first<3.2){
									color='#FF9900';
								}else if(variance_first<3.6){
									color='#FF6600';
								}else if(variance_first<4){
									color='#FF3300';
								}else{
									color='#FF0000';
								}
							    

						    }else{

						    	//alert("mean!");
						    	var color='#FFFFFF';
							    //alert(floor_mean_first);
							    if((read_column>=9) && (read_column<=15))
							    {
									if(mean_first<-4){
										color='#0000FF';
									}else if(mean_first<-3){
										color='#0033FF';
									}else if(mean_first<-2){
										color='#0066FF';
									}else if(mean_first<-1){
										color='#0099FF';
									}else if(mean_first<0){
										color='#00CCFF';
									}else if(mean_first<1){
										color='#FFFF00';
									}else if(mean_first<2){
										color='#FFCC00';
									}else if(mean_first<3){
										color='#FF9900';
									}else if(mean_first<4){
										color='#FF6600';
									}else if(mean_first<5){
										color='#FF3300';
									}else{
										color='#FF0000';
									}
								}else{
									if(mean_first<1){
										color='#0000FF';
									}else if(mean_first<2){
										color='#0033FF';
									}else if(mean_first<3){
										color='#0066FF';
									}else if(mean_first<4){
										color='#0099FF';
									}else if(mean_first<5){
										color='#00CCFF';
									}else if(mean_first<6){
										color='#FFFF00';
									}else if(mean_first<7){
										color='#FFCC00';
									}else if(mean_first<8){
										color='#FF9900';
									}else if(mean_first<9){
										color='#FF6600';
									}else if(mean_first<10){
										color='#FF3300';
									}else{
										color='#FF0000';
									}
								}
						    }
						    
						    var rectangle = new google.maps.Rectangle({
						        strokeColor: '#000000',
						        strokeOpacity: 0.1,
						        strokeWeight: 0.1,
						        fillColor: color,
						        fillOpacity: myOpacity,
						        map: map,
						        bounds: 
						        new google.maps.LatLngBounds(
						          new google.maps.LatLng(lat1,long1),
						          new google.maps.LatLng(lat2,long2))
						      });
						    $(".dim").hide();
						}
					}

					

					if(read_type=="Variance")
					{
				    	//alert("max: "+variance_max+", min: "+variance_min);
				    	fileDisplayArea.innerText = "Range of Standard Deviation ("+variance_min+", "+variance_max+")";
				    }


				}

				

				reader.readAsText(file);



			} else {
				fileDisplayArea.innerText = "File not supported!";
			}


		
		});
}
