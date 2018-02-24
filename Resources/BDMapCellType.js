var BDMapCellType = (function (_super) {
    __extends(BDMapCellType, _super);
    function BDMapCellType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BDMapCellType.prototype.value = null;
    BDMapCellType.prototype.map = undefined;

    BDMapCellType.prototype.createContent = function () {
        var self = this;
        var element = this.CellElement;
        var cellTypeMetaData = element.CellType;

        var container = $("<div id='" + this.ID + "'></div>");
        var innerContainer = $("<div id='" + this.ID + "inner'style='width:100%;'></div>");
        innerContainer.css("height", element.Height - 20);

        var MapDiv = $("<div id='" + this.ID + "map_container' style='width:100%;align:center; height:100%'></div>");
        
        innerContainer.append(MapDiv);
                       
        container.append(innerContainer);
        return container;
    }    

    BDMapCellType.prototype.getOptions = function () {
        var element = this.CellElement;
        var cellTypeMetaData = element.CellType;

        var longitude = 116.404;
        if (cellTypeMetaData.Longitude >= -180 && cellTypeMetaData.Longitude <= 180) {
            longitude = cellTypeMetaData.Longitude;
        }
        var latitude = 39.915;
        if (cellTypeMetaData.Latitude >= -90 && cellTypeMetaData.Latitude <= 90) {
            latitude = cellTypeMetaData.Latitude;
        }
        var zoom = 15;
        if (cellTypeMetaData.Zoom > 0 && cellTypeMetaData.Zoom < 18) {
            zoom = cellTypeMetaData.Zoom;
        }
        var position = false;
        if (cellTypeMetaData.Position) {
            position = cellTypeMetaData.Position;
        }
        var distance = false;
        if (cellTypeMetaData.Distance) {
            distance = cellTypeMetaData.Distance;
        }
        var readonly = false;
        if (cellTypeMetaData.ReadOnly) {
            readonly = cellTypeMetaData.ReadOnly;
        }

        return {
            longitude: longitude,
            latitude: latitude,
            zoom: zoom,
            position: position,
            distance: distance,
            readonly: readonly
        };
    }

    BDMapCellType.prototype.onLoad = function () {
        var self = this;    
        document.getElementById(this.ID + "map_container").oncontextmenu = function (e) {
            　　return false;
        }
        this.map = new BMap.Map(document.getElementById(this.ID + "map_container"));
        var options = this.getOptions()
        setTimeout(function () {            
            self.map.centerAndZoom(new BMap.Point(options.longitude, options.latitude), options.zoom);
            self.addControls(options.readonly);            
        }, 300);
        

        if (options.position) {
            this.geoLocation(options.longitude,options.latitude);
        }
        this.rightClickDistance(options.distance);
        this.rightClickSetCurrentPointMarker(options.readonly);        
        
    }

    BDMapCellType.prototype.getValueFromElement = function () {
        return this.value;
    }

    BDMapCellType.prototype.setValueToElement = function (element, value) {
        var self = this;
        this.value = value;
        this.commitValue();
        setTimeout(function () {
            self.setGeoToValue(value);
        }, 300);
    }

    BDMapCellType.prototype.setValueToMap = function (lng, lat) {
        this.value = lng + "," + lat;
        this.commitValue();
    }

    BDMapCellType.prototype.valueIsValid = function (value) {
        try
        {
            var temp = value.split(',');
            if ((temp.length == 2) && (Number(temp[0]) >= -180) && (Number(temp[0]) <= 180) && (Number(temp[1]) >= -90) && (Number(temp[1]) <= 90)) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (err)
        {
            return false;
        }
    }

    BDMapCellType.prototype.setGeoToValue = function (value) {
        var self = this;
        if (this.valueIsValid(value))
        {
            var temp = value.split(',');
            this.mapPanTo(Number(temp[0]), Number(temp[1]));
            this.setMarker(Number(temp[0]), Number(temp[1]));
        }
    }

    BDMapCellType.prototype.rightClickSetCurrentPointMarker = function (readonly) {
        var self = this;
        this.map.addEventListener("rightclick", function (e) {
            if (!readonly) {
                self.setMarker(e.point.lng, e.point.lat);
                self.mapPanTo(e.point.lng, e.point.lat);
                self.setValueToMap(e.point.lng, e.point.lat);
            }
        });
    }

    BDMapCellType.prototype.rightClickDistance = function (distance) {
        var self = this;
        this.map.addEventListener("rightclick", function (e) {
            if (distance) {
                var myDis = new BMapLib.DistanceTool(self.map);
                myDis.open();
            }
        });
        
    }

    BDMapCellType.prototype.addControls = function (readonly) {
        this.addGeoCtrl(readonly);
        this.map.addControl(new BMap.NavigationControl());
        this.map.addControl(new BMap.ScaleControl());
        this.map.enableScrollWheelZoom(true); 
    }

    BDMapCellType.prototype.addGeoCtrl = function (readonly) {
        var self = this;
        var geoCtrl = new BMap.GeolocationControl({
            showAddressBar: true,
            enableAutoLocation: true,
            offset: new BMap.Size(10, 40)
        });

        geoCtrl.addEventListener("locationSuccess", function (e) {
            if (!readonly) {
                self.setValueToMap(e.point.lng, e.point.lat);
            }
        });

        geoCtrl.addEventListener("locationError", function (e) {
            console.log(e);
        });

        this.map.addControl(geoCtrl);
    }

    BDMapCellType.prototype.geoLocation = function (lng,lat) {      
        var self = this;
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function (e) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS && e.accuracy != null) {
                self.mapPanTo(e.point.lng, e.point.lat);
                self.setMarker(e.point.lng, e.point.lat);
                self.value = e.point.lng + "," + e.point.lat;
                self.commitValue();
            }
            else {
                self.setMarker(lng, lat);
                if (e.accuracy != null && self.IsMobile()) {
                    alert("无法获取您的准确定位，请开启定位功能，刷新页面并选择允许定位");
                }
            }
        }, { enableHighAccuracy: true })
    }

    BDMapCellType.prototype.IsMobile = function () {
        var system = {
            win: false,
            mac: false
        };
        var pc = navigator.platform;//检测平台
        system.win = pc.indexOf("Win") == 0;
        system.mac = pc.indexOf("Mac") == 0;
        if (system.win || system.mac) {
            return false;
        }
        else {
            return true;
        }
    }

    BDMapCellType.prototype.mapPanTo = function(lng, lat){
        var toPoint = new BMap.Point(lng, lat);
        this.map.panTo(toPoint);
    }

    BDMapCellType.prototype.setMarker = function (lng, lat) {
        this.map.removeOverlay();
        var markerPoint = new BMap.Point(lng, lat);
        var mk = new BMap.Marker(markerPoint);
        this.map.addOverlay(mk);
    }
   
    BDMapCellType.prototype.dataPosition = function (value) {
        
    }

    BDMapCellType.prototype.disable = function () {
        _super.prototype.disable.call(this);
    }

    BDMapCellType.prototype.enable = function () {
        _super.prototype.enable.call(this);
    }

    return BDMapCellType;
}(Forguncy.CellTypeBase));

// Key format is "Namespace.ClassName, AssemblyName"
Forguncy.CellTypeHelper.registerCellType("BDMapCellType.BDMapCellType, BDMapCellType", BDMapCellType);