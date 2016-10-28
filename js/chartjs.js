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
                break
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
                break
            case 'radio':
                break
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

$(function() {
    var doc = document,
        selectStand = doc.getElementById('stands'),
        options = doc.createDocumentFragment(),
        units = [{ id: 1, name: '六福村' }, { id: 2, name: '麗寶樂園' }, { id: 3, name: '逢甲夜市' }].reverse();

    clearOption(selectStand.options, selectStand);

    for (var i = units.length + 1; i--;) {
        var option = doc.createElement('option');
        if (units.length === i) {
            option.text = '請選擇';
            option.value = undefined;
            options.appendChild(option);
        } else {
            option.text = units[i].name;
            option.value = units[i].id;
            options.appendChild(option);
        }


    }
    selectStand.appendChild(options);


    $('#datetimepicker6').datetimepicker({
        format: 'YYYY/MM/DD',
        widgetPositioning: {
            horizontal: 'right',
            vertical: 'bottom'
        }
    });
    $('#datetimepicker7').datetimepicker({
        format: 'YYYY/MM/DD',
        useCurrent: false, //Important! See issue #1075 
        widgetPositioning: {
            horizontal: 'right',
            vertical: 'bottom'
        }
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

        fdata = new FormData(document.forms['chartargu']);

        for (var i = 0, leng = forms.length - 1; i < leng; i++) {
            var selectedOP = forms[i].options || forms[i];
            if (i) {
                if (i <= 2)
                    fdata.append('duringTime[]', selectedOP.value);
                else {
                    if (selectedOP.checked && selectedOP.value === 'all') {
                        fdata.append('chartType', true);
                        break;
                    } else if (selectedOP.checked)
                        fdata.append('chartType[]', selectedOP.value);
                }
            } else {
                fdata.append('standName', selectedOP[selectedOP.selectedIndex].value);
            }
        }
        var chart = new chartApply([{ name: '啟用App裝置數', total: 250 }, { name: '服務使用狀況報表(裝置數)', total: 250 }, { name: '服務使用狀況報表(人數)', total: 250 }, { name: '各設施使用狀況報表(裝置數)', total: 250 }, { name: '各設施使用狀況報表(人數)', total: 250 }, { name: '廣告發送與兌換狀況報表(裝置數)', total: 250 }, { name: '目前設施排隊狀況報表(人數)', total: 250 }]);
    })
    
});
