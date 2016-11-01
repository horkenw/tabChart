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

function chartApply(data, refreshed) {
    this.doc = document;
    this.data = data.reverse();
    this.wrapDom = this.doc.getElementById('chart');
    this.tabClass = 'tab';
    this.chartLineup = 'themes_lineup_status';
    this.chartAd = 'themes_advertise';
    this.charRides_status_ppl = 'themes_rides_status_ppl';
    this.chartRides_status_device = 'themes_rides_status_device';
    this.chartServer_status_ppl = 'themes_server_status_ppl';
    this.chartServer_status_device = 'themes_server_status_device';
    this.chartApp_on = 'themes_app_on';
    this.refreshed = refreshed;
    this.showDateRange();
    var tabs = this.checkboxCounts();
    // var length = 2;
    this.chartTabs(tabs);
}
chartApply.prototype.chartTabs = function(tabs) {
    var frag = this.doc.createDocumentFragment(),
        li = this.doc.createElement('li'),
        counts = tabs.length;

    var liDOM = function() {
        var liClone = li.cloneNode(false),
            argu = Array.prototype.slice.call(arguments, 1)[0],
            tabID = Array.prototype.slice.call(arguments, 1)[1];
        liClone.innerHTML += sprintf('<input type=radio id=tab_%s name = %ss />', tabID[argu], this.tabClass);
        liClone.innerHTML += sprintf('<label for=tab_%s>%s</label>', tabID[argu], this.data[argu].name);
        liClone.innerHTML += sprintf('<div id="tabs_%s" class="%s-content"></div>', tabID[argu], this.tabClass);
        addEvent(liClone.getElementsByTagName('label')[0], 'click', this.placeChart.bind(this));
        // liClone.getElementsByTagName('label')[0].addEventListener('click', this.placeChart.bind(this));
        return liClone;
    }

    this.wrapDom.innerText = '';
    for (var i = counts; i--;) {
        var liEle = liDOM.call(this, frag, i, tabs);
        frag.appendChild(liEle);
    }
    this.wrapDom.appendChild(frag);
    this.wrapDom.getElementsByTagName('label')[0].click();
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
            if(allInput[i].checked && allInput[i].dataset.items)
                selected.push(allInput[i].dataset.items);
        }
    }
    return selected.reverse();
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
    var len = this.data.length,
        evt = Array.prototype.slice.call(arguments, 0)[0].target,
        cns = this.doc.createElement('canvas'),
        elemArray = [],
        frag = this.doc.createDocumentFragment();

        // if(evt.nextSibling) evt.nextSibling.removeChild();

        switch (evt.htmlFor.replace(/\btab_/gi, '')){
            case 'app_on':
                for(var i=2; i--;){
                    frag.appendChild(cns.cloneNode(true));
                    frag.children[frag.children.length-1].id=this.chartApp_on+'_'+i;
                    this.showLineChart(frag.children[frag.children.length-1].id);
                }
                break;
            case 'server_status_device':
                cns.cloneNode(false).id=this.chartServer_status_device;
                break;
            case 'server_status_ppl':
                cns.cloneNode(false).id=this.chartServer_status_ppl;
                break;
            case 'rides_status_device':
                cns.cloneNode(false).id=this.chartServer_status_device;
                break;
            case 'rides_status_ppl':
                cns.cloneNode(false).id=this.chartServer_status_ppl;
                break;
            case 'advertise':
                cns.cloneNode(false).id=this.chartAd;
                break;
            case 'lineup_status':
                cns.cloneNode(false).id=this.chartLineup;
                break;
            default:
                console.log(evt.htmlFor.replace(/\btab_/gi, ''))
                break;
        }
        if(this.refreshed) evt.nextSibling.appendChild(frag);
}
chartApply.prototype.showLineChart = function(tarNode){
    console.log(tarNode);
    var labels = Object.getOwnPropertyNames(this.data);
    var lineChartData = {
            labels: [],
            datasets: [{
                type: 'line',
                label: '總進場人數',
                backgroundColor: 'rgba(151,187,205,0.0)',
                data: pplTotal,
                borderColor: 'darkgreen',
                fill: false,
                borderWidth: 2,
                yAxisID: 'y-axis-2'
            },{
                type: 'line',
                label: '總取票人數',
                backgroundColor: 'rgba(151,187,205,0.0)',
                data: ticketTotal,
                borderColor: 'chartreuse',
                fill: false,
                borderWidth: 2,
                yAxisID: 'y-axis-2'
            },  ]
        };
}
chartApply.prototype.showBarChart = function(tarNode){

}