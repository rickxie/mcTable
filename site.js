var mmGrid = {};
window.onload = function() {

function mcGrid() {
var mcGrid = mmGrid = this;
var _ = mcGrid._ = {};

var defaultClassName = {table: '', tr: null, td: null};
var defaultConfig = {checkable: false, sortable: false, tableWidth : '', fixHeaderRow: true, fixColumnNum: 0};
var defColConfig = [];

mcGrid.InitGrid = function (tableId, config, col, data) {
    defColConfig = col;
    processingConfig(config);
    var parentDom = document.getElementById(tableId);

    //获取原始Class
    defaultClassName.table = _.getDefaultClass('#' + tableId + ' table');
    parentDom.className.replace('mc-table', '');
    parentDom.className += 'mc-table';
    var wrapPart = {
        wraperContainer: createDom('div', 'mc-table-wrapper mc-default'),
        headDivDom: createDom('div', 'mc-thead'),
        bodyDivDom: createDom('div', 'mc-tbody'),
        fixedColumn: createDom('div', 'mc-fixed-column'),
        fixedBody: createDom('div', 'mc-fixed-body')
    }
    var wraperTable = wrapPart.wraperContainer;
    var theadTxt = buildTheader(defColConfig);
    //var headTable = createElement('table', theadTxt, defaultClassName.table);
    var tbodyTxt = buildTbody(defColConfig, data);
    var bodyTable = createElement('table', theadTxt + tbodyTxt, defaultClassName.table, { width: defaultConfig.tableWidth});
    //var tableTxt = buildTable(defColConfig, data);
    wrapPart.bodyDivDom.innerHTML = bodyTable;
    appendStragy(wrapPart);
    parentDom.innerHTML = '';
    wraperTable.style.visibility = "hidden";
    parentDom.appendChild(wraperTable);
    setTimeout( function(){
        wraperTable.style.visibility = "visible";
        frozenRowColumn(parentDom, wrapPart);
    },0);
}
var appendStragy = function( wrapPart){
    if(defaultConfig.fixHeaderRow && defaultConfig.fixColumnNum > 0){
        wrapPart.fixedBody.appendChild(wrapPart.headDivDom);
        wrapPart.fixedBody.appendChild(wrapPart.bodyDivDom);
        wrapPart.wraperContainer.appendChild(wrapPart.fixedColumn);
        wrapPart.wraperContainer.appendChild(wrapPart.fixedBody);
    }else if(defaultConfig.fixHeaderRow && defaultConfig.fixColumnNum == 0){
        wrapPart.wraperContainer.appendChild(wrapPart.headDivDom);
        wrapPart.wraperContainer.appendChild(wrapPart.bodyDivDom);
    }else if(!defaultConfig.fixHeaderRow){
        wrapPart.wraperContainer.appendChild(wrapPart.bodyDivDom);
    }
}
var frozenRowColumn = function(parentDom, wrapPart) {
    var headDivDom = wrapPart.headDivDom;
    var bodyDivDom = wrapPart.bodyDivDom;
    if (defaultConfig.fixHeaderRow) {
        var bodyDivDomTable = bodyDivDom.children[0];
        var headerHeight = bodyDivDomTable.children[0].offsetHeight;
        var bodyHeight = parentDom.offsetHeight - headerHeight

        var headDivDomTable = bodyDivDomTable.cloneNode(true);
        //删除Body部分 留下Header
        headDivDomTable.removeChild(headDivDomTable.children[1]);
        //删除Header部分
        bodyDivDomTable.removeChild(bodyDivDomTable.children[0]);
        headDivDom.appendChild(headDivDomTable);

        bodyDivDom.style.height = bodyHeight;
        var tempWidth = bodyDivDom.offsetWidth > bodyDivDomTable.offsetWidth ? bodyDivDom.offsetWidth : bodyDivDomTable.offsetWidth;
        bodyDivDomTable.style.width = (tempWidth - 20);
        headDivDomTable.style.width = tempWidth;
    }

    if(defaultConfig.fixColumnNum > 0){
        var middleFixedTheadDom = parentDom.querySelector('.mc-fixed-body .mc-thead');
        var middleFixedTbodyDom = parentDom.querySelector('.mc-fixed-body .mc-tbody');
        var middleFixedHeadTable = middleFixedTheadDom.querySelector('table');
        var middleFixedBodyTable = middleFixedTbodyDom.querySelector('table');
        middleFixedTbodyDom.style.width = parentDom.offsetWidth + "px";
        var mcFixedColumnThead = middleFixedTheadDom.cloneNode(true);
        var mcFixedColumnTbody = middleFixedTbodyDom.cloneNode(true);
        var headTable = mcFixedColumnThead.querySelector('table');
        var bodyTable = mcFixedColumnTbody.querySelector('table');

        //重组左侧头部
        var trs = headTable.rows;
        _.forEach(trs, function(item, j){
            for(var i = 0; i < item.cells.length; i++){
                if(i >= defaultConfig.fixColumnNum){
                    item.cells[i].style.display = "none";
                }else{
                    item.cells[i].style.width = middleFixedHeadTable.rows[j].cells[i].offsetWidth;
                    item.cells[i].style.height = middleFixedHeadTable.rows[j].cells[i].offsetHeight;
                }
            }
        })
        //重组左侧身体
        var trs = bodyTable.rows;
        _.forEach(trs, function(item, j){
            for(var i = 0; i < item.cells.length; i++){
                if(i >= defaultConfig.fixColumnNum){
                    item.cells[i].style.display = "none";
                }else{
                    item.cells[i].style.width = middleFixedBodyTable.rows[j].cells[i].offsetWidth;
                    item.cells[i].style.height = middleFixedBodyTable.rows[j].cells[i].offsetHeight;
                }
            }
        })
        var columnDom = parentDom.querySelector('.mc-fixed-column');
        headTable.style.width = null;
        bodyTable.style.width = null;
        mcFixedColumnTbody.style.width = null;
        wrapPart.fixedBody.style.width = middleFixedTbodyDom.offsetWidth;
        mcFixedColumnTbody.style.height = middleFixedTbodyDom.clientHeight;
        columnDom.appendChild(mcFixedColumnThead);
        columnDom.appendChild(mcFixedColumnTbody);
    }



    //滚动条配置
    bodyDivDom['onscroll'] = function (i) {

        headDivDom.scrollLeft = this.scrollLeft;
        if(defaultConfig.fixColumnNum > 0){
            //var columnDom = parentDom.querySelector('.mc-fixed-column');
            //columnDom.left = this.scrollLeft;
            var fixedColumnBodyTable = wrapPart.fixedColumn.querySelector('.mc-tbody table')
            fixedColumnBodyTable.style.marginTop = -this.scrollTop;
        }
    };


}




//字段处理
var processingConfig = function(config){
    //重置默认设置
    _.extend(defaultConfig, config);
    //计算表格宽度
    var sumWidth = 0;
    //var maxWidthCol = [ 0,0];
    for(var i = 0; i < defColConfig.length; i ++){
        defColConfig[i] = _.extend( { 'min-width' : '50px', 'width': '50px', 'visible': true},defColConfig[i]);
        var colWidth = parseFloat(defColConfig[i].width);
        sumWidth += colWidth;
        //if(colWidth > maxWidthCol[0] &&  defColConfig[i].visible == true ){
        //    maxWidthCol[0] = colWidth;
        //    maxWidthCol[1] = i;
        //}
    }
    if(defaultConfig.checkable){
        sumWidth += 30;
    }
    defColConfig[defColConfig.length - 1].width = null;
    defaultConfig.tableWidth = sumWidth + 'px';
};
var createDom = function (element, className) {
    var dom = document.createElement(element);
    dom.className = className;
    return dom;
};
//构建表格对象
var buildTable = function (cols, data) {
    var head = buildTheader(cols);
    var body = buildTbody(cols, data);
    var tableDom = createElement('table', head + body, defaultClassName.table);
    return tableDom;
}

//构建表格头部
var buildTheader = function (cols) {
    var thDomList = [];
    _.forEach(defColConfig, function (item, ci) {
        if(item.visible)
            thDomList.push(createElement('th', item.text, null, item, 0, ci));
    })
    if (defaultConfig.checkable) {
        var checkBoxTxt = createElement('th', "<input type='checkbox'/>", 'check-all check-btn',null, 0, -1);
        thDomList.unshift(checkBoxTxt);
    }
    var trDom = createElement('tr', thDomList.join(''), null, null, 0)
    var tableHeadDom = createElement('thead', trDom);
    return tableHeadDom;
}
//获取列配置的 样式
var getStyle = function (col) {
    var styleStr = [];
    var allowedStyle = ['width', 'text-align'];
    _.forEach(allowedStyle, function (i) {
        if (col[i] != null) {
            styleStr.push(i + ':' + col[i]);
        }
    })

    return styleStr.join(';');
}
//创建Element 文本
var createElement = function (element, content, cls, styleConfig, ri, ci) {
            var cls = cls != null ? ' class = "' + cls + '"' : '';
            var style = '';
            if (styleConfig != null) {
                style = getStyle(styleConfig);
                style = style != null ? ' style = "' + style + '"' : '';
            }
            (ci!== undefined && (ci =' ci="'+ci+'" ')) || (ci === undefined && (ci = ''));
            (ri!== undefined && (ri =' ri="'+ri+'" ')) || (ri === undefined && (ri = ''));
            var eleDom = '<' + element + cls + ri + ci + style + '>' + content + '</' + element + '>';
            return eleDom;
        }
//构建表格数据
var buildTbody = function (cols, rows) {
    var tdDomList = [];
    var trDomList = [];
    _.forEach(rows, function (r, ri) {
        tdDomList = [];
        _.forEach(defColConfig, function (item, ci) {
            if(item.visible)
            tdDomList.push(createElement('td', r[item.name], null, item, ri+1, ci));
        })
        if (defaultConfig.checkable) {
            var checkBoxTxt = createElement('td', "<input type='checkbox'/>", 'check-btn', null,  ri+1, -1)
            tdDomList.unshift(checkBoxTxt);
        }
        trDomList.push(createElement('tr', tdDomList.join(''), null, null, ri+1));
    });
    var tableBodyDom = createElement('tbody', trDomList.join(''));
    return tableBodyDom;
}

_.forEach = function (arr, func) {
    var i = 0;
    for (i = 0; i < arr.length; i++) {
        func(arr[i], i);
    }
}
_.filter = function (arr, func) {
    var a = [];
    var i = 0;
    for (i = 0; i < arr.length; i++) {
        if (func(arr[i])) {
            a.push(arr[i]);
        }
        ;
    }
    return a;
}
_.extend = function () {
    var _isObject, _extend;
    _isObject = function (o) {
        return Object.prototype.toString.call(o) === '[object Object]';
    } //判断是否为Object
    _extend = function self(target, source) {
        var property;
        for (property in source) {
            if (_isObject(target[property]) && _isObject(source[property])) {
                self(target[property], source[property]);//递归
            }
            target[property] = source[property];
        }
    }
    var arg = arguments;
    if (arg.length <= 1) {
        return;//直接返回
    }
    else {
        var i;
        for (i = 1; i < arg.length; i++) {
            _extend(arg[0], arg[i]);
        }
    }
    if (arg.length > 0)
        return arg[0];
}
_.getDefaultClass = function (selector) {
    var tb = document.querySelectorAll(selector);
    if (tb != null && tb.length > 0) {
        return tb[0].className;
    }
}
_.all = function(arr, func){
    var isTrue = true;
    for(var i =0 ; i< arr.length; i++){
        if(!func(arr[i])){
            isTrue = false;
            break;
        }
    }
    return isTrue;
}
_.clone = function(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; ++i) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
}
 };


    var col = [
        {name: 'id', text: '编号', width: '100px'},
        {name: 'name', text: '姓名', width: '100px'},
        {name: 'address', text: "地址", width: '250px'},
        {name: 'money', text: "金额", width: '100px', 'text-align': 'right'},
        {name: 'birthDay', text: "出生日期", width: '100px', visible: true},
    ];
    var data = [
        {id: '1111', name: '小明', address: '漕河泾250号', money: 100, birthDay: '2015-12-12'},
        {id: '2222', name: '小红', address: '新传公路1550号', money: 2005, birthDay: '2015-12-12'},
        {id: '3333', name: '小兰', address: '小和家园顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶2001号', money: 3000, birthDay: '2015-12-12'}
    ]
    for (var j = 0; j < 100; j++) {
        data.push({id: '3333', name: '小兰', address: '小和家园2001号', money: 30000, birthDay: '2015-12-12'});
    }

    var a = new Date();
    var g = new mcGrid();
    g.InitGrid('mc-table', {checkable: true, fixHeaderRow: true, fixColumnNum: 1 }, col, data);
    var b = new Date();
    console.log('耗时:' + (b - a) + '毫秒');
};