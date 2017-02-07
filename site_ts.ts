import _  from './utility'
class mcGrid{
    $eventStore = { 'row_select' : []};
    defaultClassName = {table: '', tr: null, td: null};
    defColConfig = [];
    bindingData = [];
    defaultConfig = {
        $$allChecked: false,
        checkable: false, //是否显示复选框
        sortable: false, //是否可以排序
        tableWidth : '', //表格宽度
        fixHeaderRow: true, //固定标题行
        fixColumnNum: 0,    //固定前几列
        mergeColumnMainIndex: null, //需要合并的判断列
        mergeColumns: null //需要合并的列的集合
    };
    constructor(public tableDivId, public config, public col, public data) {

    },
    public on(eventName: string, f :Function ) {
        $eventStore[eventName] !== null && ( $eventStore[eventName].push(func));
    },
    private fire(eventName: string){
        switch(eventName){
            case 'row_select': {
                $eventStore['row_select'].forEach(function(func){
                    var filteredData = bindingData.filter(function(item){ return item.$$checked === true;});
                    func(filteredData);
                })
            }
        }
    },

    //字段处理
    processingConfig(config){
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
},
    //数据处理
    processingData(data){
    _.forEach(data, function(item, i){
        item.$$index = i;
        item.$$checked = false;
    })
    bindingData = data;
}

}