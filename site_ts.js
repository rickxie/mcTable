var utility_1 = require('./utility');
var mcGrid = (function () {
    function mcGrid(tableDivId, config, col, data) {
        this.tableDivId = tableDivId;
        this.config = config;
        this.col = col;
        this.data = data;
        this.$eventStore = { 'row_select': [] };
        this.defaultClassName = { table: '', tr: null, td: null };
        this.defColConfig = [];
        this.bindingData = [];
        this.defaultConfig = {
            $$allChecked: false,
            checkable: false,
            sortable: false,
            tableWidth: '',
            fixHeaderRow: true,
            fixColumnNum: 0,
            mergeColumnMainIndex: null,
            mergeColumns: null //需要合并的列的集合
        };
    }
    mcGrid.prototype.on = function (eventName, f) {
        $eventStore[eventName] !== null && ($eventStore[eventName].push(func));
    };
    mcGrid.prototype.fire = function (eventName) {
        switch (eventName) {
            case 'row_select': {
                $eventStore['row_select'].forEach(function (func) {
                    var filteredData = bindingData.filter(function (item) { return item.$$checked === true; });
                    func(filteredData);
                });
            }
        }
    };
    //字段处理
    mcGrid.prototype.processingConfig = function (config) {
        //重置默认设置
        utility_1["default"].extend(defaultConfig, config);
        //计算表格宽度
        var sumWidth = 0;
        //var maxWidthCol = [ 0,0];
        for (var i = 0; i < defColConfig.length; i++) {
            defColConfig[i] = utility_1["default"].extend({ 'min-width': '50px', 'width': '50px', 'visible': true }, defColConfig[i]);
            var colWidth = parseFloat(defColConfig[i].width);
            sumWidth += colWidth;
        }
        if (defaultConfig.checkable) {
            sumWidth += 30;
        }
        defColConfig[defColConfig.length - 1].width = null;
        defaultConfig.tableWidth = sumWidth + 'px';
    };
    //数据处理
    mcGrid.prototype.processingData = function (data) {
        utility_1["default"].forEach(data, function (item, i) {
            item.$$index = i;
            item.$$checked = false;
        });
        bindingData = data;
    };
    return mcGrid;
})();
//# sourceMappingURL=site.js.map