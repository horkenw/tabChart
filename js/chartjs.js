function clearOption(nod, appendNod) {
    while (nod.length) {
        appendNod.remove(0);
    }
}
function validate(){
    var argu = Array.prototype.slice.call(arguments, 0),
        selectchk=[false, false], id=0,
        itemschk = false;
    var errMsg = document.createElement('span');
    errMsg.className += 'red';
    errMsg.innerText = '請至少選擇一項查詢資料';
    for(var i=0, l = argu[0].length; i < l; i++){
        switch (argu[0][i].type){
            case 'select-one':
                if('undefined' !== argu[0][i].options[argu[0][i].selectedIndex].value) {
                    argu[0][i].nextSibling.innerText='';
                    selectchk[0] = true
                }
                else {
                    argu[0][i].nextSibling.innerText='';
                    argu[0][i].parentNode.insertBefore( errMsg.cloneNode(true), argu[0][i].nextSibling)
                }
                break;
            // case 'text':
            //     if(argu[0][i].value){
            //         // argu[0][i].nextSibling.innerText='';
            //         selectchk[i] = true;
            //     }
            //     // else {
            //     //     argu[0][i].nextSibling.innerText='';
            //     //     argu[0][i].parentNode.insertBefore( errMsg.cloneNode(true), argu[0][i].nextSibling)
            //     // }
            //     break
            case 'checkbox':
                if(!selectchk[1]){
                    if(argu[0][i].checked){
                        argu[0][argu[0].length-2].nextSibling.nextSibling.nextSibling.innerText='';
                        selectchk[1] = true;
                    }
                    else{
                        argu[0][argu[0].length-2].nextSibling.nextSibling.nextSibling.innerText='';
                        argu[0][i].parentNode.insertBefore( errMsg.cloneNode(true),argu[0][argu[0].length-2].nextSibling.nextSibling.nextSibling)
                    }
                }
                break;
            case 'radio':
                break;
            default:
                break;
        }
    } 
    while(selectchk[id]){
        id++;
    }
    if(id === selectchk.length) itemschk=true;
    return itemschk;
}
function getSearchinfo(rules){
    var reback;
    $.ajax({
        url: '/backend/report/getReport',
        processData: true,
        async: false,
        type: 'post',
        data: {siteId: rules.get('siteId'), startDate: rules.get('startDate'), endDate: rules.get('endDate'), pictureId: rules.getAll('pictureId[]')},
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-CSRF-Token', csrfToken);
        },
        success: function (files) {
            reback = files;
        }
    }).always( function() {
    });
    return reback;
}

$(function() {
    var doc = document,
        selectStand = doc.getElementById('stands'),
        options = doc.createDocumentFragment();

    units = units.reverse();
    clearOption(selectStand.options, selectStand);

    for (var i = units.length + 1; i--;) {
        var option = doc.createElement('option');
        if (units.length === i) {
            option.text = '請選擇';
            option.value = undefined;
            options.appendChild(option);
        } else {
            option.text = units[i].siteName;
            option.value = units[i].siteId;
            options.appendChild(option);
        }
    }
    selectStand.appendChild(options);


    $('#datetimepicker6').datetimepicker({
        format: 'YYYY-MM-DD',
        widgetPositioning: {
            horizontal: 'right',
            vertical: 'bottom'
        },
        locale: 'zh-tw'
    });
    $('#datetimepicker7').datetimepicker({
        format: 'YYYY-MM-DD',
        useCurrent: false, //Important! See issue #1075 
        widgetPositioning: {
            horizontal: 'right',
            vertical: 'bottom'
        },
        locale: 'zh-tw'
    });
    $("#datetimepicker6").on("dp.change", function(e) {
        $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
    });
    $("#datetimepicker7").on("dp.change", function(e) {
        $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
    });
    var fdata, forms = document.forms['chartargu'];
    $('#send').on('click', function() {
        if(!validate.call(this, forms)) return;

        $( 'body' ).mask( '讀取中，請稍後…' );
        $(this).addClass('deny');
        fdata = new FormData(document.forms['chartargu']);
        var today = ytd = new Date();

        for (var i = 0, leng = forms.length - 1; i < leng; i++) {
            var selectedOP = forms[i].options || forms[i];
            if (i) {
                if (i <= 2)
                    if(1==i)
                        fdata.append('startDate', selectedOP.value);
                    else {
                        var date = selectedOP.value.length ? selectedOP.value : moment(ytd.setDate(today.getDate() - 1)).format('YYYY-MM-DD');
                        selectedOP.value = date;
                        if(moment(fdata.get('startDate')).format('x') > moment(date).format('x')){
                            var startDate = moment([moment(date).year(), moment(date).month()-2]).startOf('month').format('YYYY-MM-DD');
                            forms[i-1].value = startDate;
                            fdata.delete('startDate');
                            fdata.append('startDate', startDate);
                        }
                        fdata.append('endDate', selectedOP.value);
                    }
                else {
                    if (selectedOP.checked && selectedOP.value === 'all') {
                        for(var i= 1, l=document.getElementById('chart_list').getElementsByTagName('input').length; i<l; i++){
                            fdata.append('pictureId[]', i);
                        }
                        break;
                    } else if (selectedOP.checked)
                        fdata.append('pictureId[]', selectedOP.value);
                }
            } else {
                fdata.append('siteId', selectedOP[selectedOP.selectedIndex].value);
            }
        }
        var chart = new chartApply(getSearchinfo(fdata), true, 'zh-Tw');
    })
});
