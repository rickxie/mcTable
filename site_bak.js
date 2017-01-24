var mmGrid = {};
window.onload = function() {

function mcGrid() {
var $=fizzle=function(h,c){var e=0,n,m,p,a=[],g,q,l=0,r=[];var k=/^#(\w)+$/;function f(i){return i!=null&&i.window==window}function o(i){return Object.prototype.toString.call(i)=="[object Array]"}function d(i){return Object.prototype.toString.call(i)=="[object Function]"}function b(t){var j=[],i=t.length;if(i==null||typeof t==="string"||d(t)||f(t)){j[0]=t}else{while(i){j[--i]=t[i]}}return j}function s(G,u){var E,C,F,x,I=[],J,t,z,D,w,H,v,A,K,y,B;u=o(u)?u:[u];t=G.match(/^\w+/)!==null&&G.match(/^\w+/)[0]||"*";for(E=0,F=u.length;E<F;E++){I=I.concat(b(u[E].getElementsByTagName(t.toUpperCase())))}if(t!=="*"){G=G.replace(new RegExp("^"+t,""),"")}if(/^#/.test(G)){z=G.match(/^#\w+/)[0].replace("#","");G=G.replace(new RegExp("^#"+z,""),"");for(C=0,F=I.length;C<F;C++){J=I[C];if(J.id!=z){I.splice(C,1);F--;--C}}}if(/^\./.test(G)){D=G.match(/^\.\w+/)[0].replace(".","");G=G.replace(new RegExp("^."+D,""),"");for(C=0,F=I.length;C<F;C++){J=I[C];className=" "+J.className+" ";H=new RegExp(D,"");if(!H.test(className)){I.splice(C,1);F--;--C}}}if(/^\[[^\]]*\]/.test(G)){seed=G.match(/^\[[^\]]*\]/)[0].replace("[","").replace("]","");G=G.replace("["+seed+"]","");A=seed.match(/^\w+/)[0];seed=seed.replace(new RegExp("^"+A,""),"");expr=seed.match(/^(!=|=)/)[0];seed=seed.replace(new RegExp("^"+expr,""),"");K=seed;if(expr==="!="){for(C=0,F=I.length;C<F;C++){J=I[C];if(css.attr(J,A)==K){I.splice(C,1);F--;--C}}}else{for(C=0,F=I.length;C<F;C++){J=I[C];if(css.attr(J,A)!=K){I.splice(C,1);F--;--C}}}}if(/^:/.test(G)){seed=G.match(/^:\w+/)[0].replace(":","");G=G.replace(new RegExp("^:"+seed,""),"");v=seed.match(/^\w+/)[0];seed=seed.replace(v,"");switch(v){case"odd":for(F=I.length,C=I.length-1;C>=0;C--){J=I[C];if(C%2==1){I.splice(C,1);F--;--C}}break;case"even":for(F=I.length,C=I.length-1;C>=0;C--){J=I[C];if(C%2==0){I.splice(C,1);F--;--C}}break;case"random":seed=seed||1;if(seed<1){for(C=0,F=I.length;C<F;C++){y=Math.random();J=I[C];if(y>seed){I.splice(C,1);F--;--C}}}else{B=[];seed=I.length-parseInt(seed);while(B.length<seed){y=Math.round(Math.random()*(I.length-1));B[B.length]=I[y];I.splice(y,1)}}break}}G=G.replace(/^\s+/,"");if(G){return s(G,I)}else{return I}}h=h||document;c=c&&c.nodeType===1?c:document;if(typeof h===document||f(h)){return h}if(h.nodeType===1){return h}if(typeof h=="string"){h=h.replace(/^\s+|\s+$/g,"");if(k.test(h)){return document.getElementById(h.replace("#",""))}else{q=h.split(",");for(n=0,len=q.length;n<len;n++){m=0;if(q[n]&&!/^\s+$/.test(q[n])){a=s(q[n],c);r=r.concat(a)}}}}return r};

var mcGrid = mmGrid = this;
var _ = mcGrid._ = {};

var defaultClassName = {table: '', tr: null, td: null};
var defaultConfig = {checkable: false, sortable: false};


mcGrid.InitGrid = function (tableId, config, col, data) {
    _.extend(defaultConfig, config);
    var tableDom = document.getElementById(tableId);
    //获取原始Class
    defaultClassName.table = _.getDefaultClass('#' + tableId + ' table');
    tableDom.className.replace('mc-table', '');
    tableDom.className += 'mc-table';
    //创建头部html
    var theadTxt = buildTheader(col);
    var headTable = createElement('table', theadTxt, 'table');
    //创建身体html
    var tbodyTxt = buildTbody(col, data);
    var bodyTable = createElement('table', theadTxt + tbodyTxt, 'table');

    //类型
    var wrapPart = {
        headDivDom: createElement('div',headTable, 'mc-thead'),
        bodyDivDom: createElement('div',bodyTable, 'mc-tbody'),
        tfootTable: createElement('div',null, 'mc-tfoot')
    }
    var wraperTable = createElement('div',wrapPart.headDivDom + wrapPart.bodyDivDom, 'fht-table-wrapper mc-default');
    tableDom.innerHTML = wraperTable;

    setTimeout(function(){
        //这时候就渲染好了
        console.log(tableDom.offsetHeight);
    },0);
}


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
    _.forEach(cols, function (item) {
        thDomList.push(createElement('th', item.text, null, item));
    })
    if (defaultConfig.checkable) {
        var checkBoxTxt = createElement('th', "<input type='checkbox'/>", 'check-all check-btn');
        thDomList.unshift(checkBoxTxt);
    }
    var tableHeadDom = createElement('thead', thDomList.join(''));
    return tableHeadDom;
}

//获取列配置的 样式
var getStyle = function (col) {
    var styleStr = [];
    var allowedStyle = ['width'];
    _.forEach(allowedStyle, function (i) {
        if (col[i] != null) {
            styleStr.push(i + ':' + col[i]);
        }
    })

    return styleStr.join(';');
}
//创建Element 文本
var createElement = function (element, content, cls, styleConfig) {
            var cls = cls != null ? ' class = "' + cls + '"' : '';
            var style = '';
            if (styleConfig != null) {
                style = getStyle(styleConfig);
                style = style != null ? ' style = "' + style + '"' : '';
            }
            var eleDom = '<' + element + cls + style + '>' + content + '</' + element + '>';
            return eleDom;
        }
//构建表格数据
var buildTbody = function (cols, rows) {
    var tdDomList = [];
    var trDomList = [];
    _.forEach(rows, function (r) {
        tdDomList = [];
        _.forEach(cols, function (item) {
            tdDomList.push(createElement('td', r[item.name], null, item));
        })
        if (defaultConfig.checkable) {
            var checkBoxTxt = createElement('td', "<input type='checkbox'/>", 'check-btn')
            tdDomList.unshift(checkBoxTxt);
        }
        trDomList.push(createElement('tr', tdDomList.join('')));
    })
    var tableBodyDom = createElement('tbody', trDomList.join(''));
    return tableBodyDom;
}

_.forEach = function (arr, func) {
    var i = 0;
    for (i = 0; i < arr.length; i++) {
        func(arr[i]);
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
 };


    var col = [
        {name: 'id', text: '编号', width: '100px'},
        {name: 'name', text: '姓名', width: '100px'},
        {name: 'address', text: "地址", width: '150px'},
        {name: 'money', text: "金额", width: '100px'},
        {name: 'birthDay', text: "出生日期", width: '100px'},
    ];

    var data = [
        {id: '1111', name: '小明', address: '漕河泾250号', money: 1000, birthDay: '2015-12-12'},
        {id: '2222', name: '小红', address: '新传公路1550号', money: 2005, birthDay: '2015-12-12'},
        {id: '3333', name: '小兰', address: '小和家园2001号', money: 3000, birthDay: '2015-12-12'}
    ]
    for (var j = 0; j < 100; j++) {
        data.push({id: '3333', name: '小兰', address: '小和家园2001号', money: 3000, birthDay: '2015-12-12'});
    }

    var a = new Date();
    var g = new mcGrid();
    g.InitGrid('mc-table', {checkable: true}, col, data);
    var b = new Date();
    console.log('耗时:' + (b - a) + '毫秒');
};
