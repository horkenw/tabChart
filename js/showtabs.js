'use strict';

var sprintf = function(str) {
    var args = arguments,
        flag = true,
        i = 1;

    str = str.replace(/%s/g, function() {
        var arg = args[i++];

        if (typeof arg === 'undefined') {
            flag = false;
            return '';
        }
        return arg;
    });
    return flag ? str : '';
};

function addEvent(obj,evt,fn) {
    if (obj.addEventListener)
        obj.addEventListener(evt,fn,true);
    else if (obj.attachEvent)
        obj.attachEvent('on'+evt,fn);
}

function chartApply(data) {
    this.doc = document;
    this.data = data.reverse();
    this.wrapDom = this.doc.getElementById('chart');
    this.tabClass = 'tab';
    // this.chartIdArray = ['themes_lineup_status','themes_advertise']
    this.chartLineup = 'themes_lineup_status';
    this.chartAd = 'themes_advertise';
    this.charRides_status_ppl = 'themes_rides_status_ppl';
    this.chartRides_status_device = 'themes_rides_status_device';
    this.chartServer_status_ppl = 'themes_server_status_ppl';
    this.chartServer_status_device = 'themes_server_status_device';
    this.chartApp_on = 'themes_app_on';
    var length = this.checkboxCounts();
    // var length = 2;
    this.chartTabs(length);
}
chartApply.prototype.chartTabs = function(counts) {
    var frag = this.doc.createDocumentFragment(),
        li = this.doc.createElement('li');

    var liDOM = function() {
        var liClone = li.cloneNode(false),
            argu = Array.prototype.slice.call(arguments, 1);
        liClone.innerHTML += sprintf('<input type=radio id=tab_%s name = %ss />', this.chartIdArray[argu], this.tabClass);
        liClone.innerHTML += sprintf('<label for=tab_%s>%s</label>', this.chartIdArray[argu], this.data[argu].name);
        liClone.innerHTML += sprintf('<div id="%s-content'+argu+'" class="%s-content"></div>', this.tabClass, this.tabClass);
        addEvent(liClone.getElementsByTagName('label')[0], 'click', this.placeChart.bind(this));
        // liClone.getElementsByTagName('label')[0].addEventListener('click', this.placeChart.bind(this));
        return liClone;
    }

    this.wrapDom.innerText = '';
    for (var i = counts; i--;) {
        var liEle = liDOM.call(this, frag, i);
        frag.appendChild(liEle);
    }
    this.wrapDom.appendChild(frag);
    this.wrapDom.getElementsByTagName('input')[0].click();
    this.showDateRange()
}
chartApply.prototype.checkboxCounts = function(){
    var allInput = this.doc.getElementById('chart_list').getElementsByTagName('input'),
        selected = [];
    for(var i=0, l=allInput.length; i<l; i++){
        if (allInput[i].id === 'all' && allInput[i].checked){
            selected.push(9);
            break;
        }
        else{

        }
    }
    return selected;
}
chartApply.prototype.showDateRange = function(){
    this.showDate = this.doc.getElementsByClassName('durning');
    var startDay = this.doc.getElementsByClassName('date')[0].getElementsByTagName('input')[0].value,
        endDat = this.doc.getElementsByClassName('date')[1].getElementsByTagName('input')[0].value,
        unit = ['年', '月', '日'];
        startDay = startDay.split('/');
        endDat = endDat.split('/');
        for(var i=0, l=unit.length; i< l; i++){
            startDay.splice(i*2+1, 0, unit[i]);
            endDat.splice(i*2+1, 0, unit[i]);
        }
        
    this.showDate[0].innerText = '查詢期間：'+ startDay.join('')+' ~ '+ endDat.join('');
}
chartApply.prototype.placeChart = function(){
    console.log(this);
}