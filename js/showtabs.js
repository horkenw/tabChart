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
};

function chartApply(data, refreshed, language) {
    this.doc = document;
    this.data = data;
    this.wrapDom = this.doc.getElementById('chart');
    this.tabClass = 'tab';
    this.refreshed = refreshed;
    this.language = chartApply.language[language];
    this.showDateRange();
    var tabs = this.checkboxCounts();
    this.chartTabs(tabs);

    $( 'body' ).unmask();
    $('#send').removeClass('deny');
};

chartApply.prototype.chartTabs = function(tabs) {
    var frag = this.doc.createDocumentFragment(),
        li = this.doc.createElement('li'),
        counts = tabs.length;
    tabs.reverse();

    var liDOM = function() {
        var liClone = li.cloneNode(false),
            argu = Array.prototype.slice.call(arguments, 1),
            tabID = argu[1],
            tabsName = {facilityUseAllCount: '目前設施排隊狀況報表(人數)', adReport: '廣告發送與兌換狀況報表(裝置數)', userFacilityReport: '各設施使用狀況報表(人數)', deviceFacilityReport: '各設施使用狀況報表(裝置數)'
                , userReport: '服務使用狀況報表(人數)', deviceReport:'服務使用狀況報表(裝置數)', appUserReport: '啟用App裝置數'};

        liClone.innerHTML += sprintf('<input type=radio id=tab_%s name = %ss />', tabID[argu[0]], this.tabClass);
        liClone.innerHTML += sprintf('<label for=tab_%s data-chartname=%s>%s</label>', tabID[argu[0]], this.data[argu[0]].name, tabsName[this.data[argu[0]].name]);
        liClone.innerHTML += sprintf('<div id="tabs_%s" class="%s-content"></div>', tabID[argu[0]], this.tabClass);
        addEvent(liClone.getElementsByTagName('label')[0], 'click', this.placeChart.bind(this));
        addEvent(liClone.getElementsByTagName('label')[0], 'touchstart', this.placeChart.bind(this));
        return liClone;
    };

    this.wrapDom.innerText = '';
    for (var i = counts; i--;) {
        var liEle = liDOM.call(this, frag, i, tabs);
        frag.appendChild(liEle);
    }
    this.wrapDom.appendChild(frag);
    this.wrapDom.getElementsByTagName('label')[0].click();
};

chartApply.prototype.checkboxCounts = function(){
    var allInput = this.doc.getElementById('chart_list').getElementsByTagName('input'),
        selected = [];
    for(var i=0, l=allInput.length; i<l; i++){
        if (allInput[i].id === 'all' && allInput[i].checked){
            for(var j= 1, allInputlen=allInput.length; j<allInputlen; j++)
                selected.push(allInput[j].dataset.items);
            break;
        }
        else{
            if(allInput[i].checked && allInput[i].dataset.items)
                selected.push(allInput[i].dataset.items);
        }
    }
    return selected.reverse();
};

chartApply.prototype.showDateRange = function(){
    this.showDate = this.doc.getElementsByClassName('durning');
    var startDay = this.doc.getElementsByClassName('date')[0].getElementsByTagName('input')[0].value,
        endDat = this.doc.getElementsByClassName('date')[1].getElementsByTagName('input')[0].value,
        unit = ['年', '月', '日'];
    startDay = startDay.split('-');
    endDat = endDat.split('-');
    for(var i=0, l=unit.length; i< l; i++){
        startDay.splice(i*2+1, 0, unit[i]);
        endDat.splice(i*2+1, 0, unit[i]);
    }

    this.showDate[0].innerText = '查詢期間：'+ startDay.join('')+' ~ '+ endDat.join('');
};

chartApply.prototype.placeChart = function(){ // 給予tab基本的canvas，準備畫圖表
    var evt = Array.prototype.slice.call(arguments, 0)[0].target;

    for(var i=this.data.length; i--;)
        if(this.data[i].name === evt.getAttribute('data-chartname')){
            this.chartChild = this.data[i][this.data[i].name];
            break;
        }

    // if(evt.nextSibling) evt.nextSibling.removeChild();
    var appendCanvas = function(){
        var cns = this.doc.createElement('canvas'),
            frag = this.doc.createDocumentFragment();

        for(var item in this.chartChild){
            if(typeof this.chartChild[item] === 'string') continue;
            frag.appendChild(this.setLabelName(item));
            frag.appendChild(cns.cloneNode(true));
            frag.children[frag.children.length-1].id=item.toLowerCase();
            frag.children[frag.children.length-1].setAttribute('data-chartId', item);
            evt.nextSibling.appendChild(frag);
            if(this.chartChild[item].length)
                this.showLineChart(evt.nextSibling.childNodes[evt.nextSibling.childNodes.length-1], item);
            else
                this.noDataException(evt.nextSibling.childNodes[evt.nextSibling.childNodes.length-1]);
        }
    };

    var setSingleItem = function(){
        var itemsList = this.chartChild;
        for(var i=itemsList.length; i--;){
            this.chartChild = itemsList[i];
            appendCanvas.call(this);
        }
    };

    var forADreport = function(){
        this.chartChild={};
        this.chartChild.adUseVOList = this.data[0][this.data[0].name].adUseVOList;
        appendCanvas.call(this);
        this.chartChild={};
        this.chartChild.adAgeList = this.data[0][this.data[0].name].adAgeList;
        setSingleItem.call(this);
    };

    switch (evt.htmlFor.replace(/\btab_/gi, '')){
        case 'app_on':
            this.cleanContent(evt.nextSibling);
            appendCanvas.call(this);
            break;
        case 'server_status_device':
            this.cleanContent(evt.nextSibling);
            appendCanvas.call(this);
            break;
        case 'server_status_ppl':
            this.cleanContent(evt.nextSibling);
            appendCanvas.call(this);
            break;
        case 'rides_status_device':
            this.cleanContent(evt.nextSibling);
            setSingleItem.call(this);
            break;
        case 'rides_status_ppl':
            this.cleanContent(evt.nextSibling);
            setSingleItem.call(this);
            break;
        case 'advertise':
            this.cleanContent(evt.nextSibling);
            forADreport.call(this);
            break;
        case 'lineup_status':
            this.cleanContent(evt.nextSibling);
            setSingleItem.call(this);
            break;
        default:
            console.log(evt.htmlFor.replace(/\btab_/gi, ''));
            break;
    }
};

chartApply.prototype.showLineChart = function(tarNode, chartIdx){
    var labelsArray=[], color10=['hsl(16,74%,42%)', 'hsl(160, 31%, 45%)', 'hsl(36, 64%, 45%)', 'hsl(103,80%,36%)', 'hsl(181,80%,36%)', 'hsl(237,80%,36%)', 'hsl(140, 96%, 45%)', 'hsl(280,80%,36%)', 'hsl(310,80%,36%)', 'hsl(360,80%,36%)'];
    var addTotal = function(data, idx){
        data.totalCount=[];
        for(var i=data[idx[0]].length; i--;){
            var totalCount = 0;

            for(var j=idx.length; j--;) totalCount += data[idx[j]][i];
            data.totalCount.push(totalCount);
        }
        data.totalCount.reverse();
        idx.push('totalCount');
    };
    var sortToArray = function(data, addTotal){
        var arrayItem=[], dataObj={};
        return (function(){
            labelsArray=Object.getOwnPropertyNames(data[0]).reverse();
            if(!labelsArray) return;
            labelsArray.reduce(function(previousValue, currentValue, index) {
                    previousValue[currentValue]=[];
                    for(var i= 0, l=data.length; i<l; i++){
                        previousValue[currentValue].push(data[i][currentValue]);
                    }
                    return previousValue;
                }, dataObj
            );
            return dataObj;
        })();
    };
    var chartData, //將以每日物件重新整理為以項目為單位的陣列
        lineChartData = {
        labels: [],
        datasets: []
    };
    chartData = sortToArray(this.chartChild[chartIdx], addTotal);
    var removeidx = labelsArray.indexOf('reservationDate')>=0 ? labelsArray.indexOf('reservationDate'): labelsArray.indexOf('range'),
        chartLabels = labelsArray.splice(removeidx, 1);
    if (labelsArray.indexOf('facilityName')>=0) labelsArray.splice(labelsArray.indexOf('facilityName'), 1)
    if(chartIdx!=='ageAllList' && chartIdx!== 'dateList' && chartIdx!=='adUseVOList') addTotal(chartData, labelsArray);

    for(var i=labelsArray.length; i--;) // 根據分類(ex: 男生、女生)，設定圖表基本選項
        lineChartData.datasets.push({
            type: 'line',
            label: this.language[labelsArray[i]],
            backgroundColor: 'hsl(65, 100%, 85%)',
            borderColor: color10[i],
            data: [],
            fill: false,
            borderWidth: 3,
            yAxisID: 'y-axis-2',
            lineTension: 0.1
        });
    var resortlabels = labelsArray.reverse();
    for(var i= 0, l=chartData[chartLabels].length; i<l; i++){
        lineChartData.labels.push(moment(chartData[chartLabels][i]).format('MM/DD')!== 'Invalid date'?moment(chartData[chartLabels][i]).format('MM/DD'):chartData[chartLabels][i]); //設定 label 標籤為日期
        for(var j = labelsArray.length; j--;)
            lineChartData.datasets[j].data.push(chartData[resortlabels[j]][i]);
    }
    var lineChartOptions = {
        scaleGridLineWidth: 1,
        responsive: true,
        legend: {
            display: true,
            labels: {
                fontColor: 'hsl(0, 0%, 50%)'
            }
        },
        scales: {
            xAxes: [{
                stacked: true,
                gridLines: {
                    display: false
                },
            }],
            yAxes: [{
                type: "linear",
                display: true,
                id: "y-axis-2",
                gridLines:{
                    display: true
                },
                labels: {
                    show:true,

                },
            }]
        },
    };
    var ctxLine = tarNode.getContext("2d");
    var myNewLineChart = new Chart(ctxLine, {
        type: 'line',
        data: lineChartData,
        options: lineChartOptions
    });
    ctxLine.fillStyle='white';
    console.log(lineChartData);
};

chartApply.prototype.noDataException = function(target){
    console.log(1)
};

chartApply.prototype.setLabelName = function(tagName){
    var chartTitle = this.doc.createElement('label');
    if(tagName){
        chartTitle.className = 'titleStyle';
        chartTitle.innerText = tagName;
        // this.language[tagName]
    }

    return chartTitle;
};

chartApply.prototype.cleanContent = function(node){
    node.innerText='';
}
chartApply.language={
    'zh-Tw':{
        all: '總數',
        totalCount: '總取票 (裝置數/人數)',
        total:'廣告發出',
        redeem:'兌換',
        male: '男生',
        female:'女生',
        delete: '刪除總數',
        canceled: '逾時裝置數',
        userCanceled:'自行取消裝置數',
        used: '進場裝置數',
        canceledUser: '逾時人數',
        usedUser: '進場人數',
        userCanceledUser: '自行取消人數',
        deviceDateList: '服務使用狀況報表(裝置數)',
    }
}

chartApply.prototype.showBarChart = function(tarNode){

};