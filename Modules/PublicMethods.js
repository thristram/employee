//
//  PublicMethods.js
//  A Helper Class
//
//  Created by Fangchen Li on 12/31/17.
//  Copyright © 2017 Fangchen Li. All rights reserved.
//

let hat = require('hat');


/************************************/

//Public//

/************************************/
var currentMessageID = 0;
module.exports = {


//////////////////////////////////////
    //CONTENT START//
//////////////////////////////////////


    timestamp: function (){

        return Math.floor(Date.now() / 1000);


    },
    getClassTime: function(timestamp){
        if(!timestamp){
            return '';
        }
	    if(timestamp){
		    var date = new Date(timestamp * 1000);
	    }	else	{
		    var date = new Date()
	    }

	    var hour = date.getHours();
	    hour = (hour < 10 ? "0" : "") + hour;

	    var min  = date.getMinutes();
	    min = (min < 10 ? "0" : "") + min;

	    var sec  = date.getSeconds();
	    sec = (sec < 10 ? "0" : "") + sec;

	    var year = date.getFullYear();

	    var month = date.getMonth() + 1;
	    month = (month < 10 ? "0" : "") + month;

	    var day  = date.getDate();
	    day = (day < 10 ? "0" : "") + day;

	    return month + "/" + day + "/" + year;
    },

    getDateTime: function(timestamp) {

        if(timestamp){
            var date = new Date(timestamp * 1000);
        }	else	{
            var date = new Date()
        }


        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;

        var min  = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;

        var sec  = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;

        var year = date.getFullYear();

        var month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;

        var day  = date.getDate();
        day = (day < 10 ? "0" : "") + day;

        return month + "/" + day + "/" + year + " " + hour + ":" + min + ":" + sec;

    },

    checksum: function(s){

        var len = s.length;
        var XOR = 0;
        for (var i = 0; i < len; i++) {
            XOR ^=  s[i];
        }

        return XOR;
    },

    timeConverter(UNIX_timestamp){
        var a = new Date(UNIX_timestamp * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = month + ' ' + date ;
        return time;
    },
    getClientIP(req){
        let clientIP = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            (req.connection.socket ? req.connection.socket.remoteAddress : null);
        if(clientIP === "::1"){
            clientIP = "127.0.0.1"
        }
        return clientIP
    },
    parseConfigFromDB(data, valueField){
        let fetchedResult = {};
        for(let i in data) {
            let fields = data[i].field.split(".");
            let rootField = fields[0];
            let secField = fields[1];
            if (!fetchedResult.hasOwnProperty(rootField)) {
                fetchedResult[rootField] = {}
            }
            fetchedResult[rootField][secField] = unescape(data[i][valueField]);

        }
        return fetchedResult;
    }






};

Number.prototype.errorDescription = function(deviceType){
    let errorCodes = this.toString(2).split("").map( x => parseInt(x) === 1 ).reverse();
    let errors = [];

    switch(deviceType.seraphType()){
        case "SS":
	    case "SM":
            errorCodes[0] ? errors.push("Upper Link Connection") : "";
            errorCodes[1] ? errors.push("BLE") : "";
            errorCodes[3] ? errors.push("MFi") : "";
            errorCodes[4] ? errors.push("Temperature & Humidity Sensor") : "";
            errorCodes[5] ? errors.push("CO Sensor") : "";
            errorCodes[6] ? errors.push("CO2 Sensor") : "";
            errorCodes[7] ? errors.push("PM 2.5 Sensor") : "";
            errorCodes[8] ? errors.push("Motion Sensor 1") : "";
            errorCodes[9] ? errors.push("Motion Sensor 2") : "";
            errorCodes[10] ? errors.push("IR") : "";
		    errorCodes[13] ? errors.push("Media Connect") : "";
            break;
        case "ST":
            errorCodes[0] ? errors.push("Upper Link Connection") : "";
            errorCodes[3] ? errors.push("Proximity Sensing") : "";
            errorCodes[4] ? errors.push("Touch Control") : "";
            break;
        case "SC":
            errorCodes[0] ? errors.push("Upper Link Connection") : "";
            break;
        case "SL":
            errorCodes[0] ? errors.push("Upper Link Connection") : "";
            errorCodes[3] ? errors.push("AC Power Shortage") : "";
            break;
        default:
            errorCodes[0] ? errors.push("Upper Link Connection") : "";
            break;
    }
    if(errors.length > 1){
        let last = errors.pop();
        return errors.join(", ") + " and " + last + " Error";
    }   else if(errors.length > 0)    {
        return errors[0] + " Error"
    }   else if(this != 0){
        return "Unknown Error"
    }

    return "";
};
Number.prototype.channels = function(){
    let channels = [];
    let CHs = this.toString(2).split("").map( x => parseInt(x) ).reverse();
    for(let index in CHs){
        if(CHs[index] === 1){
            channels.push(parseInt(index) + 1);
        }
    }
    return channels;
};
Number.prototype.celsius = function(type){
    if(type.toUpperCase() === "FAHRENHEIT" || this > 50){
        return Math.round((this - 32) / 1.8);
    }
    return this;
}
String.prototype.seraphType = function(){
    let type = this.substr(0,2);
    if((type === "SA") ||  (type === "SG")){
        return this.substr(0,4);
    }
    return type;
};
String.prototype.deviceID = function(){
    let deviceInfo = this.split("-");
    return deviceInfo[0];

};
String.prototype.channelID = function(){
    let deviceInfo = this.split("-");
    if(deviceInfo.length > 1){
        return parseInt(deviceInfo[1]);
    }
    return 0;
};
String.prototype.deviceValue = function(){
    let deviceInfo = this.split(":");
    if(deviceInfo.length > 1){
        return parseInt(deviceInfo[1]);
    }
    return 0;
};
String.prototype.channelIDFromCChannel = function(){
    if(this.charAt(0) === "C"){
        return parseInt(this.substring(1));
    }
    return 0;
};
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
String.prototype.fullName = function(){
	switch(this + ""){
	    case "SS" : return "Seraph Sense";
		case "SC" : return "Seraph Control";
		case "ST" : return "Seraph Touch";
		case "SM" : return "Seraph Media Connect";
		case "SU" : return "Seraph U Camera";
		case "SW" : return "Seraph Window Shade";
		case "SL" : return "Seraph Light Control";
		case "SP" : return "Seraph Power Control";
		case "SE" : return "Seraph LED";
		case "SAAC" : return "Seraph Smart AC";
		default : return "Seraph Device";
    }
};
String.prototype.isValidEmailAddress = function () {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(this.toLowerCase());
};
String.prototype.replaceAll = function(str1, str2, ignore)
{
	return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}
String.prototype.getCountryFull = function(){
    switch(this + ""){
        case "AU": return "Australia";
        case "CN": return "China";
        case "SG": return "Singapore";
        case "US": return "United States";
        default: return this + "";
    }
}
Number.prototype.agoShort = function(){
    return timeDifference(module.exports.timestamp(), this)
}
function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = (current - previous)*1000;

    if (elapsed < msPerMinute) {
        return Math.round(elapsed/1000) + 's ago';
    }

    else if (elapsed < msPerHour) {
        return Math.round(elapsed/msPerMinute) + 'm ago';
    }

    else if (elapsed < msPerDay ) {
        return Math.round(elapsed/msPerHour ) + 'h ago';
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';
    }
}
Number.prototype.contentTypeString = function(){
	switch(this + 0){
        case 1: return "article";
        case 2: return "video";
        case 3: return "poll";
        case 4: return "topic";
        case 5: return "course";
        case 6: return "user";
        default: return this;
    }
}
String.prototype.contentType = function(){
	switch(this + ""){
		case "article": return 1;
		case "video": return 2;
		case "poll": return 3;
        case "topic": return 4;
        case "course": return 5;
        case "user": return 6;
		default: return 0;
	}
}
String.prototype.userAction = function(){
    switch(this + ""){
        case "like": return 1;
        case "bookmark": return 2;
        case "share": return 3;
        case "follow": return 4;
        default: return 0;
    }
}
Number.prototype.userActionString = function(){
    switch(this + 0){
        case 1: return "like";
        case 2: return "bookmark";
        case 3: return "share";
        case 4: return "follow";
        default: return this;
    }
}
String.prototype.currencySymbol = function(){
    switch(this + ""){
        case "cny": return "￥";
        case "usd": return "$";
        default: return "";
    }
}
String.prototype.isiPhoneNotch = function(){
    let model = ["iPhone10,3", "iPhone10,6", "iPhone11,2","iPhone11,6","iPhone11,8","iPhone12,1","iPhone12,3","iPhone12,5"]
    if(model.indexOf(this + "") > -1){
        return true
    }
    return false
}
String.prototype.CDNImageAddress = function(){
    let rawAddress = unescape(this);

    let rawsArray = rawAddress.split(":");
    if(rawsArray.length === 3){
        return unescape(getCloudfrontAddress(rawsArray[1], rawsArray[2]) + (rawsArray[2][0] === '/' ? '' : '/') + rawsArray[2]);
    }
    return rawAddress.CDNAddress()
}
String.prototype.CDNAddress = function(){
    let rawAddress = unescape(this);
    return unescape(getCloudfrontAddress(CDNConfig.bucket, CDNConfig.region) + rawAddress);
}
String.prototype.AppleModel = function(){
    let identifier = this + "";
    switch (identifier) {
        case "iPod1,1":
            return "iPod Touch 1";
        case "iPod2,1":
            return "iPod Touch 2";
        case "iPod3,1":
            return "iPod Touch 3";
        case "iPod4,1":
            return "iPod Touch 4";
        case "iPod5,1":
            return "iPod Touch 5";
        case "iPod7,1":
            return "iPod Touch 6";
        case "iPod9,1":
            return "iPod Touch 7";


        // iPhones

        case "iPhone3,1":
        case "iPhone3,2":
        case "iPhone3,3":
            return "iPhone 4";
        case "iPhone4,1":
            return "iPhone 4s";
        case "iPhone5,1":
        case "iPhone5,2":
            return "iPhone 5";
        case "iPhone5,3":
        case "iPhone5,4":
            return "iPhone 5c";
        case "iPhone6,1":
        case "iPhone6,2":
            return "iPhone 5s";
        case "iPhone7,2":
            return "iPhone 6";
        case "iPhone7,1":
            return "iPhone 6 Plus";
        case "iPhone8,1":
            return "iPhone 6s";
        case "iPhone8,2":
            return "iPhone 6s Plus";
        case "iPhone8,4":
            return "iPhone SE";
        case "iPhone9,1":
        case "iPhone9,3":
            return "iPhone 7";
        case "iPhone9,2":
        case "iPhone9,4":
            return "iPhone 7 Plus";

        case "iPhone10,1":
        case "iPhone10,4":
            return "iPhone 8";
        case "iPhone10,2":
        case "iPhone10,5":
            return "iPhone 8 Plus";
        case "iPhone10,3":
        case "iPhone10,6":
            return "iPhone X";
        case "iPhone11,8":
            return "iPhone XR";
        case "iPhone11,2":
            return "iPhone XS";
        case "iPhone11,6":
            return "iPhone XS Max";
        case "iPhone12,1":
            return "iPhone 11";
        case "iPhone12,3":
            return "iPhone 11 Pro";
        case "iPhone12,5":
            return "iPhone 11 Pro Max";

        // iPads

        case "iPad2,1":
        case "iPad2,2":
        case "iPad2,3":
        case "iPad2,4":
            return "iPad 2";
        case "iPad3,1":
        case "iPad3,2":
        case "iPad3,3":
            return "iPad 3";
        case "iPad3,4":
        case "iPad3,5":
        case "iPad3,6":
            return "iPad 4";
        case "iPad6,11":
        case "iPad6,12":
            return "iPad 5";
        case "iPad7,5":
        case "iPad7,6":
            return "iPad 6";
        case "iPad7,11":
        case "iPad7,12":
            return "iPad 7";
        case "iPad4,1":
        case "iPad4,2":
        case "iPad4,3":
            return "iPad Air";
        case "iPad5,3":
        case "iPad5,4":
            return "iPad Air 2";
        case "iPad11,3":
        case "iPad11,4":
            return "iPad Air 3";

        case "iPad2,5":
        case "iPad2,6":
        case "iPad2,7":
            return "iPad Mini";
        case "iPad4,4":
        case "iPad4,5":
        case "iPad4,6":
            return "iPad Mini 2";
        case "iPad4,7":
        case "iPad4,8":
        case "iPad4,9":
            return "iPad Mini 3";
        case "iPad5,1":
        case "iPad5,2":
            return "iPad Mini 4";



        case "iPad6,3":
        case "iPad6,4":
            return "iPad Pro 9.7 Inch";
        case "iPad6,7":
        case "iPad6,8":
            return "iPad Pro 12.9 Inch";
        case "iPad7,1":
        case "iPad7,2":
            return "iPad Pro 12.9 Inch 2";
        case "iPad7,3":
        case "iPad7,4":
            return "iPad Pro 10.5 Inch";
        case "iPad8,1":
        case "iPad8,2":
        case "iPad8,3":
        case "iPad8,4":
            return "iPad Pro 11 Inch";
        case "iPad8,5":
        case "iPad8,6":
        case "iPad8,7":
        case "iPad8,8":
            return "iPad Pro 12.9 Inch 3";

        // Others

        case "AppleTV5,3":
            return "Apple TV 4";
        case "AppleTV6,2":
            return "Apple TV 4k";
        case "i386":
        case "x86_64":
            return "Simulator";
        default:
            return identifier;
    }
}
function getCloudfrontAddress(bucket, region){

    if(global.cloudfront[bucket]){
        return global.cloudfront[bucket]
    }

    if(["cn-north-1", "cn-northwest-1"].indexOf(region) > -1){
        return 'https://' + bucket + '.s3.' + region + '.amazonaws.com.cn'
    }   else    {
        return 'https://' + bucket + '.s3.amazonaws.com'
    }

}