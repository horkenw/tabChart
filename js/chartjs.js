function clearOption(nod, appendNod) {
    while (nod.length) {
        appendNod.remove(0);
    }
}
function errorMsg(message){
    var errMsg = document.createElement('span');
    errMsg.className += 'red';
    errMsg.innerText = message;

    return errMsg;
}
function validate(){
    let itemschk = true;
    const target = document.querySelectorAll('[data-validate]');
    for(let i = target.length; i--;)
        switch (target[i].dataset.validate){
            case 'option':
                target[i].nextSibling.innerText=''
                if(!target[i].selectedIndex){
                    itemschk = false;
                    target[i].parentNode.insertBefore(errorMsg('請至少選擇一項查詢據點'), target[i].nextSibling);
                }
                break;
            case 'multi':
                if(target[i].lastElementChild.localName==='span') target[i].lastElementChild.innerText=''
                if(!selectBox.length){
                    itemschk = false;
                    target[i].insertBefore(errorMsg('請至少選擇一項圖表'), target[i].lastChild);
                }
                break;
            default:
                return false;
        }
    return itemschk;
}
function getSearchinfo(rules){
    let reback;
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
const selectBox = [];
$(function() {
    const doc = document,
        selectStand = doc.getElementById('stands'),
        options = doc.createDocumentFragment();

    let units = [{ siteId: 1, siteName: '六福村' }, { siteId: 2, siteName: '麗寶樂園' }, { siteId: 3, siteName: '逢甲夜市' }].reverse();
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

    const fdata = new FormData(document.forms['chartargu']), forms = document.forms['chartargu'];
    $('#chart_list').on('click', (evt) => {
        if(evt.target.localName === 'label') return;
        let option = evt.target;
        if(option.value === 'all'){
            let checkboxs = document.getElementsByName('c')
            if(option.checked) selectBox.splice(0, selectBox.length, '1', '2', '3', '4', '5', '6', '7');
            else selectBox.splice(0, selectBox.length);
            for (var i = 0; i < checkboxs.length; i++) {
                checkboxs[i].checked = option.checked;
            }
            return ;
        }
        if(option.value && selectBox.indexOf(option.value) < 0) selectBox.push(option.value);
        else selectBox.splice(selectBox.indexOf(option.value), 1);
    })

    $('#send').on('click', function() {
        // if(!validate.call(this, forms)) return;
        if(!validate.call()) return;

        $(this).addClass('deny');
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
                else break;
            } 
            else {
                fdata.append('siteId', selectedOP[selectedOP.selectedIndex].value);
            }
        }
        for(let i=selectBox.length; i--;)
            fdata.append('pictureId[]', selectBox[i]);

        var chart = new chartApply(getSearchinfo(fdata), true, 'zh-Tw');
    })
});
