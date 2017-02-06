var mmGrid = {};
window.onload = function() {

function mcGrid() {
var mcGrid = mmGrid = this;
var _ = mcGrid._ = {};
    var $eventStore = { 'row_select' : []};
    mcGrid.fire = function(eventName){
        switch(eventName){
            case 'row_select': {
                $eventStore['row_select'].forEach(function(func){
                    var filteredData = bindingData.filter(function(item){ return item.$$checked === true;});
                    func(filteredData);
                })
            }
        }
    }
    mcGrid.on = function(eventName,func){
        $eventStore[eventName] !== null && ( $eventStore[eventName].push(func))    }

//配置全局对象
var defaultClassName = {table: '', tr: null, td: null};
var defaultConfig = {
    $$allChecked: false,
    checkable: false, //是否显示复选框
    sortable: false, //是否可以排序
    tableWidth : '', //表格宽度
    fixHeaderRow: true, //固定标题行
    fixColumnNum: 0,    //固定前几列
    mergeColumnMainIndex: null, //需要合并的判断列
    mergeColumns: null //需要合并的列的集合
};
var defColConfig = [];
var bindingData = [];
mcGrid.InitGrid = function (tableId, config, col, data) {
    defColConfig = col;
    processingData(data);
    processingConfig(config);

    var parentDom = document.getElementById(tableId);

    //获取原始Class
    defaultClassName.table = _.getDefaultClass('#' + tableId + ' table');
    parentDom.removeClass('mc-table');
    parentDom.addClass('mc-table');
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
        frozenRowColumn(parentDom, wrapPart);
        wraperTable.style.visibility = "visible";
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
    //合并行
    mergeRow(bodyDivDom);

    //构造冻结固定列
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
    //绑定事件
    bindEvent(parentDom,bodyDivDom, headDivDom, wrapPart);

}


var bindEvent = function(parentDom, bodyDivDom, headDivDom, wrapPart ){
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


    //Row hover
    var allTr = parentDom.getElementsByTagName('tr');
    function focusRow(rowId, isOver){
        allTr.forEach(function(tr){
            var trRid = tr.getAttribute("ri");
            if(trRid === rowId){
                if(isOver){
                    tr.addClass('hover');
                }else {
                    tr.removeClass('hover');
                }
            }
        })
    }
    _.forEach(allTr, function(tr){
        tr['onmouseover'] = function(){
            var trRid = tr.getAttribute("ri");
            focusRow(trRid, true);
        }
        tr['onmouseout'] = function(){
            var trRid = tr.getAttribute("ri");
            focusRow(trRid, false);
        }
    })
    //CheckBox
    if(defaultConfig.checkable === true){
        var allCheckBox = parentDom.getElementsByTagName('td').filter(function(item){
            return item.getAttribute('ci') === '-1' &&  item.getAttribute('ri') !=='-1';
        });
        var checkAllBox =  parentDom.getElementsByTagName('th').filter(function(item){
            return item.getAttribute('ci') === '-1' &&  item.getAttribute('ri') === '-1';
        });
        //单个选项框选中
        allCheckBox.forEach(function(cbtd){
            var cb = cbtd.querySelector('input[type=checkbox]');
            cb['onchange'] = function(){
                var checked = this.checked;
                var tr = this.parentTag('tr');
                var rowIndex = tr.getAttribute('ri');
                var checkedRow = parentDom.querySelectorAll('tr[ri="'+rowIndex+'"]');
                checkedRow.forEach(function(trItem){
                    //更新checkbox 选中
                    var cbb = trItem.querySelector('input[type=checkbox]');
                    cbb.checked = checked;
                    //更新样式
                    if(checked){
                        trItem.addClass('checked');
                    }else{
                        trItem.removeClass('checked');
                    }
                })
               var rowData = _.first(bindingData, {$$index :rowIndex });
                rowData.$$checked = checked;
                mcGrid.fire('row_select');
            }
        })

        //变更所有选中状态
        function allCheckChange(checked){
            checkAllBox.forEach(function(cabth){
                var cb = cabth.querySelector('input[type=checkbox]');
                cb.checked = checked;
                defaultConfig.$$allChecked =  checked;
                //更新所有复选框
                allCheckBox.forEach(function(cbtd){
                    var cb = cbtd.querySelector('input[type=checkbox]');
                    cb.checked = checked;
                })
                //更新所有数据
                bindingData.forEach(function(item){
                    item.$$checked = checked;
                })

                var allDataRow = parentDom.getElementsByTagName('tr').filter(function(item){
                    return  item.getAttribute('ri') !== '-1';
                })
                allDataRow.forEach(function(item){
                    if(checked){
                        item.addClass('checked');
                    }else{
                        item.removeClass('checked');
                    }
                })
                mcGrid.fire('row_select');
            })
        }


        //绑定选中状态变化
        checkAllBox.forEach(function(cabth){
            var cb = cabth.querySelector('input[type=checkbox]');
            cb['onchange'] = function(){
                allCheckChange(this.checked);
            }
        })
    }

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
//数据处理
var processingData = function(data){
    _.forEach(data, function(item, i){
        item.$$index = i;
        item.$$checked = false;
    })
    bindingData = data;
}
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
            thDomList.push(createElement('th', item.text, null, item, -1, ci));
    })
    if (defaultConfig.checkable) {
        var checkBoxTxt = createElement('th', "<input type='checkbox'/>", 'check-all check-btn',null, -1, -1);
        thDomList.unshift(checkBoxTxt);
    }
    var trDom = createElement('tr', thDomList.join(''), null, null, -1)
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
            tdDomList.push(createElement('td', r[item.name], null, item, r.$$index, ci));
        })
        if (defaultConfig.checkable) {
            var checkBoxTxt = createElement('td', "<input type='checkbox'/>", 'check-btn', null, r.$$index, -1)
            tdDomList.unshift(checkBoxTxt);
        }
        trDomList.push(createElement('tr', tdDomList.join(''), null, null, r.$$index));
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

_.first = function(arr, predict) {
    for (var i = 0; i < arr.length; i++) {
        if (predict instanceof Object) {
            var allMeet = true;
            for (name in predict) {
                if (predict[name] != arr[i][name]) {
                    allMeet = false;
                    break;
                }
            }
            if (allMeet) {
                return arr[i];
            }
        } else if (predict instanceof Function) {
            if (predict(arr[i])) {
                return arr[i];
            }
        }
    }
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

//公共基础类
    NodeList.prototype.forEach = HTMLCollection.prototype.forEach = Array.prototype.forEach = function(func){
    _.forEach(this, function(item, rowId){
        func(item, rowId);
    })
}
    NodeList.prototype.filter = HTMLCollection.prototype.filter = Array.prototype.filter =  function(func){
        return _.filter(this, func);
    }
    Element.prototype.addClass = function(cls) {
        var obj = this
        var obj_class = obj.className; //获取 class 内容.
            if(obj_class != null)
        {
            obj_class.replace(/(\s+)/gi, ' ');
            var classArr = obj_class.split(' ');
            if (classArr.indexOf(cls) > -1)
                return;
        }
        blank = (obj_class != '') ? ' ' : '';//判断获取到的 class 是否为空, 如果不为空在前面加个'空格'.
        added = obj_class + blank + cls;//组合原来的 class 和需要添加的 class.
        obj.className = added;//替换原来的 class.
    }
    Element.prototype.removeClass = function (cls){
    var obj = this;
    var obj_class = ' '+obj.className+' ';//获取 class 内容, 并在首尾各加一个空格. ex) 'abc    bcd' -> ' abc    bcd '
    obj_class = obj_class.replace(/(\s+)/gi, ' '),//将多余的空字符替换成一个空格. ex) ' abc    bcd ' -> ' abc bcd '
        removed = obj_class.replace(' '+cls+' ', ' ');//在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
    removed = removed.replace(/(^\s+)|(\s+$)/g, '');//去掉首尾空格. ex) 'bcd ' -> 'bcd'
    obj.className = removed;//替换原来的 class.
}
    Element.prototype.hasClass = function (cls){
    var obj = this;
    var obj_class = obj.className,//获取 class 内容.
        obj_class_lst = obj_class.split(/\s+/);//通过split空字符将cls转换成数组.
    x = 0;
    for(x in obj_class_lst) {
        if(obj_class_lst[x] == cls) {//循环数组, 判断是否包含cls
            return true;
        }
    }
    return false;
}
    Element.prototype.parentTag = function(tagName){
        var parentNode = this.parentNode;
        do{
            if(parentNode.tagName.toUpperCase() === tagName.toUpperCase() || parentNode.tagName.toUpperCase() == 'BODY'){
                break;
            }
            var parentNode = parentNode.parentNode;
        }
        while(true)
        if(parentNode.tagName.toUpperCase() === 'BODY')
        {
            return null;
        }
        else {
            return parentNode;
        }
    }
    function isInteger(obj) {  return (obj | 0) === obj ;}
    //合并行
    var mergeRow = function(bodyDivDom){
        if(defaultConfig.mergeColumnMainIndex != null && defaultConfig.mergeColumns != null
            && defaultConfig.mergeColumns.length > 0 && isInteger(defaultConfig.mergeColumnMainIndex )){
            var rowConfig = [];
            analyseRows(rowConfig);
            transformRows(bodyDivDom, rowConfig);
        }
    }
    function analyseRows(rowConfig) {
        var col = defaultConfig.mergeColumnMainIndex;
        var rows = bindingData;
        var mergedColumnIndex = null;
        var mergedColumnPropName = '';
        for(var i = 0; i < defColConfig.length; i++){
            if(defColConfig[i].visible === true){
                mergedColumnIndex == null? mergedColumnIndex = 0 : mergedColumnIndex += 1;
            }
            if(mergedColumnIndex == col){
                mergedColumnPropName = defColConfig[i].name;
                break;
            }
        }
        var groupRows = [];
        var sameRows = [];
        var lastValue = null;
        for (var i = 0; i < rows.length; i++) {
            var cur = rows[i][mergedColumnPropName];
            if (lastValue === null) {
                lastValue = cur;
            }
            if (cur === lastValue) {
                sameRows.push(i)
            } else {
                groupRows.push(sameRows);
                sameRows = [];
                sameRows.push(i);
                lastValue = cur;
            }
        }
        if(sameRows.length != 0){
            groupRows.push(sameRows);
        }
        rowConfig = groupRows;
    }

    function transformRows(bodyDivDom, rowConfig) {
        var collist = defaultConfig.mergeColumns;
        collist = collist.sort(function (a, b) {
            return a > b;
        });
        var allTr = bodyDivDom.querySelectorAll('tr').filter(function (item) {
            return item.getAttribute('ri') !== '-1';
        })

        function getRowSpanCount(rowId, colId){
            if(collist.indexOf(colId) > -1)
            {
                var rowColCollection = _.first(rowConfig, function(item){
                    return item.indexOf(colId);
                });
                if(rowColCollection[0] == colId && rowColCollection.length == 1){
                    return 0; //不需要动
                } else if(rowColCollection[0] == colId && rowColCollection.length > 1){
                    return -1; //需要移除
                } else if(rowColCollection[0] != colId && rowColCollection.length > 1){
                    return rowColCollection.length;
                }
            }else {
                //不需要动
                return 0;
            }
        }
        //设置Td 配置所有列
        allTr.forEach(function(trDom){
            var allTdDom = trDom.children;
            var rowId = trDom.getAttribute('ri');
            allTdDom.forEach(function(tdDom){
                var colId = tdDom.getAttribute('ci');
                //是否需要移除
                if()
            })
        })
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
        {id: '2222', name: '小红2', address: '新传公路1550号3', money: 2005, birthDay: '2015-12-12'},
        {id: '3333', name: '小兰', address: '小和家园顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶2001号', money: 3000, birthDay: '2015-12-12'}
    ]
    for (var j = 0; j < 20; j++) {
        data.push({id: '3333', name: '小兰', address: '小和家园2001号', money: 30000, birthDay: '2015-12-12'});
    }

    var a = new Date();
    var g = new mcGrid();
    g.InitGrid('mc-table', {
        checkable: true,
        fixHeaderRow: true,
        fixColumnNum: 2,
        mergeColumnMainIndex: 0,
        mergeColumns: [0,1,2]
    }, col, data);
    var b = new Date();
    g.on('row_select', function(data){
        console.log(data);
    });
    console.log('耗时:' + (b - a) + '毫秒');
};