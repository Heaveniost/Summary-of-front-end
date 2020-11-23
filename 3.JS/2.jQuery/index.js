/**
 * @content 决策小组
 * @author 路莹
 * @UpdateDate 2019/09/21
 * 合规效能平台
 * 
 **/

var delect = ''//判断表格填写
var isTable;
var saveFlag = 0//判断是否可以保存
var dataB
var ID
var launderMoney = 0 //判断是否存在决策领导小组
var compile = 0//判断是否是服务合规人
var peoNum = 0//判断人数是否为奇数且大于等于3且小于等于9
var deptList = [];
var compliance = []//服务合规人员ID
var groupMember1 = []
var groupMember2 = []
var groupMember3 = []
var deptData = []
var groupId;
let pageStatus = '';
let repeat1 = 0;
let headVal = 0;
let headmanIsRepeat = 0;
let pendragonIsRepeat = 0;
let memberIsRepeat = 0;
let attendIsRepeat = 0;
let type1;
let overAllIds = [];//用来存放翻页需要勾选的数据
// 用于存放营业部的值
let presidHr = '';
// 南京分公司
var pname = ''
// 用于存放组长
var leader = ''
// 存放组员是一个数组
var memberArr = []
// 存放组员id数组
var memberArrNum = []
// 接收合规人员数组
var heGuiArr = []
// 当前登陆人
var loginNum = "";
var loginUnitName = "";
$(function () {
    getCurrentLoginUser(); //获取当前登陆人编号
    //权限更改
    permissionChange(loginNum)
    if (loginUnitName != "") {
        $("#lauderTeam").val(loginUnitName).trigger('change');
    }
    var itable = TableInit(); // 决策小组查询列表信息获取
    var itable1 = TableInit1(); // 新增页面组长列表信息获取
    var itable2 = TableInit2(); // 新增页面副组长列表信息获取
    var itable3 = TableInit3(); // 新增页面成员列表信息获取
    let itable4 = TableInit4(); // 新增页面列席列表信息获取
    var itable5 = TableInit5(); // 详情页面-组长列表内容
    var itable6 = TableInit6(); // 详情页面-副组长列表内容
    var itable7 = TableInit7(); // 详情页面-成员列表内容
    let itable10 = TableInit10(); // 详情页面-列席列表内容
    var itable8 = TableInit8(); // 新增页面合规人员列表信息信息获取
    var itable9 = TableInit9(); // 选择人员内容
    itable.Init();
    itable1.Init();
    itable2.Init();
    itable3.Init();
    itable4.Init();
    itable5.Init();
    itable6.Init();
    itable7.Init();
    itable8.Init();
    itable9.Init();
    itable10.Init();

    // 首页点击新增进入新增页面
    $('#BtnAdd').on('click', function () {
        $('.panel-title').html('决策领导小组新增');
        getDept(null); // 获取新增页面‘所在部门’下拉框内容
        $('.decision-manage-list').hide();
        $('.decision-manage-detail').hide();
        $('.decision-manage-new').show();
        // 新增导出按钮隐藏
        $('#exportBtnUpData').hide()
        $("#moneyTeam").attr('disabled', 'disabled');
        $("#moneyTeam").val("");
        $("#teamName").removeAttr("disabled");
        $("#teamName").val("").select2();
        // 添加一个字段,默认就是不勾选
        $('#directlyUnder').removeAttr('checked')
        pageStatus = 'new';
        select2DropDownAddIcon();
        // 清空列表页和新建页所有表格数据数据
        overAllIds = [];
        $('#lauderTable').bootstrapTable("removeAll");
        $('#headman').bootstrapTable("removeAll");
        $('#pendragon').bootstrapTable("removeAll");
        $('#member').bootstrapTable("removeAll");
        $('#attend').bootstrapTable("removeAll");
        groupId = null;
    });

    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 13) {
            e.preventDefault();
            var listDisplay = $('.decision-manage-list').css('display');
            if (listDisplay !== 'none') {
                $('#lauderTable').bootstrapTable('refreshOptions', {pageNumber: 1});
            }
            var addPersonDisplay = $('#add-person-items').css('display');
            if (addPersonDisplay !== 'none') {
                $('#pesonList').bootstrapTable('refreshOptions', {pageNumber: 1});
            }
            var addMatchPersonDisplay = $('#add-match-person-items').css('display');
            if (addMatchPersonDisplay !== 'none') {
                $('#match-peson-list').bootstrapTable('refreshOptions', {pageNumber: 1});
            }
        }
    };
});

// 选择人员弹框查询按钮
$('#person-search').on('click', function (e) {
    e.preventDefault();
    $('#pesonList').bootstrapTable('refreshOptions', {pageNumber: 1});
});
$('#match-search').on('click', function (e) {
    e.preventDefault();
    $('#match-peson-list').bootstrapTable('refreshOptions', {pageNumber: 1});
});

// 获取部门下拉框信息
function getDept(id) {
    $.ajax({
        type: "POST",
        dataType: "json",
        async: false,
        contentType: 'application/json;charset=UTF-8',
        url: "/hgxn-platform/BaseGroupService/inquireOfTwoGroupsDepa",
        data: JSON.stringify(id),
        success: function (response) {
             const {data} = response || {};
            deptData = []
            for (let i in data) {
                deptData.push({id: data[i].resid, text: data[i].department});
            }
            $('#teamName').empty().select2({
                language: 'zh-CN',
                data: deptData
            });
            $('#deptName').empty().select2({
                language: 'zh-CN',
                data: deptData
            });
            select2DropDownAddIcon();

        },
        error: function (data) {
            console.log('获取所在部门信息失败');
        }
    });
}

// 决策小组查询列表信息获取
var TableInit = function () {
    var myTableInit = new Object();
    var lauderTable = $('#lauderTable');
    var deleteBtn = $('#Btndel')
    myTableInit.Init = function () {
        lauderTable.bootstrapTable({
            url: '/hgxn-platform/BaseGroupService/queryBaseGroup',
            method: 'POST',
            queryParams: function (params) {//传递给服务器的数据
                var json = {
                    groupName: $("#lauderName").val().trim() == "" ? null : $('#lauderName').val(),
                    deptNameStr: $("#lauderTeam").val().trim() == "" ? null : $('#lauderTeam').val(),
                    limit: params.limit,
                    offset: (params.offset / params.limit),
                    type: 2
                }
                return JSON.stringify(json);
            },
            locale: 'zh-CN',
            striped: false, // 是否显示行间隔色
            pagination: true, // 是否显示分页（*）
            sortable: true, // 是否启用排序
            sortOrder: "desc", // 排序方式
            paginationLoop: true,
            sidePagination: "server", // 分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1, // 初始化加载第一页，默认第一页
            pageSize: tableRelatedSetups.pageSize(),
            pageList: tableRelatedSetups.pageList(),
            strictSearch: true,
            clickToSelect: true, // 是否启用点击选中行
            cardView: false, // 是否显示详细视图
            detailView: false, // 是否显示父子表
            onLoadError: function (status, jqXHR) {
                console.log(jqXHR);
                layer.msg("加载数据失败", {time: 3000, icon: 2});
            },
            columns: [
                {
                    field: 'datastate',
                    checkbox: true,
                },
                {
                    field: 'groupName',
                    title: '小组名称',
                }, {
                    field: 'deptNameStr',
                    title: '部门名称',
                }, {
                    field: 'groupMemberName',
                    title: '组长姓名',
                    width: 100
                }, {
                    field: 'groupMemberBadge',
                    title: '组长工号',
                    width: 110
                }, {
                    field: 'duty',
                    title: '岗位名称',
                }, {
                    field: 'caozuo',
                    title: '操作',
                    width: 130,
                    events: operateEvents,
                    formatter: function () {
                        return [
                            '<a  href="#" class="detailButton" style="padding-right:15px;box-sizing:border-box" singleSelected=true>详情</a>',
                            '<a  href="#" class="compile" style="padding-right:15px;box-sizing:border-box" singleSelected=true>编辑</a>',
                            // '<a  href="#" class="exportBtn" singleSelected=true>导出</a>',
                        ].join('');
                    } //自定义方法，添加操作按钮
                }
            ]
        });
        // checkbox click
        lauderTable.on('check.bs.table uncheck.bs.table', function () {
            deleteBtn.prop('disabled', !lauderTable.bootstrapTable('getSelections').length);
        });
        // checkbox all click
        lauderTable.on('check-all.bs.table uncheck-all.bs.table', function () {
            deleteBtn.prop('disabled', !lauderTable.bootstrapTable('getSelections').length);
        });

        // 删除数据
        deleteBtn.off('click').on('click', function () {
            BtchDeleteBook();
        });

        function BtchDeleteBook() {
            var complaintId = getSelectedId();
            console.log(complaintId, '确认要删除这个数据吗？')
            layer.confirm('确定要删除选中数据吗?', {icon: 0, title: '提示'}, function (index) {
                $.ajax({
                    data: JSON.stringify(complaintId),
                    contentType: 'application/json;charset=UTF-8',
                    async: false,
                    dataType: 'json',
                    type: "POST",
                    url: "/hgxn-platform/BaseGroupService/delectBaseHeader",
                    success: function (data) {
                        if (data.success == true) {
                            layer.msg("已删除", {time: 3000, icon: 1});
                            $("#lauderTable").bootstrapTable('refreshOptions', {pageNumber: 1});
                        } else {
                            layer.msg("删除失败", {time: 3000, icon: 2});
                        }
                    },
                    error: function (status, jqXHR) {
                        console.log(jqXHR);
                        layer.msg("删除失败", {time: 3000, icon: 2});
                    }
                });
                layer.close(index);
            });
        }

        // 获取已选中的小组id
        function getSelectedId() {
            return $.map($('#lauderTable').bootstrapTable('getSelections'),
                function (row) {
                    return row.groupId;
                }
            )
        }
    };

    // 查询按钮
    $("#BtnSearch").off('click').on('click', function (e) {
        lauderTable.bootstrapTable('refreshOptions', {pageNumber: 1});
    });
    //重置
    $('#BtnReset').click(function () {
        // 清空输入条件
        $('#lauderName, #lauderTeam').val('');
        $("#lauderTable").bootstrapTable('refreshOptions', {pageNumber: 1});
    });
    return myTableInit;
};

// 决策小组列表内详情和编辑按钮逻辑
window.operateEvents = {
    // 点击详情，进入详情页面
    'click .detailButton': function (e, val, row, index) {
        // 置空组员数组数据
        memberArr = [];
        // 置空南京分公司
        pname = '';
        // 置空组员工号数据
        memberArrNum = [];
        overAllIds = [];
        $('.panel-title').html('决策领导小组详情');
        getDept(row.groupId);
        $('.decision-manage-list, .decision-manage-new').hide();
        $('.decision-manage-detail').show();
        var complaintId = row.groupId;
        datailAjax(complaintId);
        // 加上逻辑判断
        if(row.orgtype=='JGLX04'||row.orgtype=='JGLX09'){
            presidHr=row.presidHr
            pname=row.pname + ';'
        }
    },
    // 点击编辑页面
    'click .compile': function (e, val, row, index) {
        // 置空组员数组数据
        memberArr = [];
        // 置空南京分公司
        pname = '';
         // 置空组员工号数据
         memberArrNum = [];
        overAllIds = [];
        getDept(row.groupId); // 获取新增页面‘所在部门’下拉框内容
        $('#exportBtnUpData').show()//编辑页面导出按钮显示
        $('.panel-title').html('决策领导小组修改');
        $('.decision-manage-list, .decision-manage-detail').hide();
        $('.decision-manage-new').show();
        $('#teamName').attr('disabled', 'disabled');
        $('#teamName').val(row.deptName).trigger("change");
        $("#moneyTeam").val($("#teamName option:selected").text() + "决策领导小组");
        groupId = row.groupId;
        compileAjax(groupId);
        // 加上逻辑判断
        if(row.orgtype=='JGLX04'||row.orgtype=='JGLX09'){
            presidHr=row.presidHr
            pname=row.pname + ';'
        }
    },
    // 导出操作
    // 'click .exportBtn': function (e, val, row, index) {
    //     e.preventDefault();
    //     const {groupName, deptNameStr} = row || {};
    //     var parma = {
    //         groupName,
    //         deptNameStr,
    //         limit: 10,
    //         offset: 0,
    //         type: 2 //2为决策领导小组，1为反洗钱工作小组
    //     };
    //     var url = "/hgxn-platform/ExportTableService/downloadBaseGroup";
    //     queryExport(parma,url);
    // }
};

// 详情内容
function datailAjax(complaintId) {
    $.ajax({
        url: '/hgxn-platform/BaseGroupService/queryBaseGroupByHeaderId',
        data: JSON.stringify(complaintId),
        contentType: 'application/json;charset=UTF-8',
        async: false,
        dataType: 'json',
        type: "POST",
        success: function (data) {
            $("#groupName").val(data.data.groupName);
            $("#deptName").val(data.data.deptName).trigger('change');
            $("#lastUpdatedBy").val(data.data.lastUpdatedBy);
            $("#lastUpdateDate").val(moment(data.data.lastUpdateDate).format('YYYY-M-D HH:mm:ss'));
            $("#directlyUnderDetail").prop('checked',data.data.directlyUnder)
            var data = data.data.list;
            TableInit5(data);//保留组长
            TableInit6(data);
            TableInit7(data);//保留成员
            TableInit10(data);
        },
        error: function (error) {
            console.log('错误')
        }
    })
}

// 编辑内容
function compileAjax(complaintId) {
    $.ajax({
        url: '/hgxn-platform/BaseGroupService/queryBaseGroupByHeaderId',
        data: JSON.stringify(complaintId),
        contentType: 'application/json;charset=UTF-8',
        async: false,
        dataType: 'json',
        type: "POST",
        success: function (data) {
            console.log(data.data.directlyUnder, '点击进入编辑页面')
            $('#directlyUnder').attr('checked',data.data.directlyUnder)
            var data = data.data.list
            console.log(data, '编辑内容')
            for (let i = 0; i < data.length; i++) {
                if (data[i].groupMemberType == 1) {
                    overAllIds.push({
                        groupMemberBadge: data[i].groupMemberBadge, // 工号
                        groupMemberName: data[i].groupMemberName,  // 姓名
                        duty: data[i].duty, // 职位名称
                        groupMemberDuty: data[i].groupMemberDuty, // 职位编码 TODO
                        groupMemberType: 1, // 类型：组长：-1、副组长：2、成员：3 、列席：4 TODO
                        groupItemId: data[i].groupItemId,
                        type: "headman"
                    })
                }
                if (data[i].groupMemberType == 2) {
                    overAllIds.push({
                        groupMemberBadge: data[i].groupMemberBadge, // 工号
                        groupMemberName: data[i].groupMemberName,  // 姓名
                        duty: data[i].duty, // 职位名称
                        groupMemberDuty: data[i].groupMemberDuty, // 职位编码 TODO
                        groupMemberType: 2, // 类型：组长：-1、副组长：2、成员：3 、列席：4 TODO
                        groupItemId: data[i].groupItemId,
                        type: "pendragon"
                    })
                }
                if (data[i].groupMemberType == 3) {
                    overAllIds.push({
                        groupMemberBadge: data[i].groupMemberBadge, // 工号
                        groupMemberName: data[i].groupMemberName,  // 姓名
                        duty: data[i].duty, // 职位名称
                        groupMemberDuty: data[i].groupMemberDuty, // 职位编码 TODO
                        groupMemberType: 3, // 类型：组长：-1、副组长：2、成员：3 、列席：4 TODO
                        groupItemId: data[i].groupItemId,
                        type: "member"
                    })
                }
                if (data[i].groupMemberType == 4) {
                    overAllIds.push({
                        groupMemberBadge: data[i].groupMemberBadge, // 工号
                        groupMemberName: data[i].groupMemberName,  // 姓名
                        duty: data[i].duty, // 职位名称
                        groupMemberDuty: data[i].groupMemberDuty, // 职位编码 TODO
                        groupMemberType: 4, // 类型：组长：-1、副组长：2、成员：3 、列席：4 TODO
                        groupItemId: data[i].groupItemId,
                        type: "attend"
                    })
                }
            }
            TableInit1(data)
            TableInit2(data)
            TableInit3(data)
            TableInit4(data)
        },
        error: function (error) {
            console.log('错误')
        }
    })
}

// 副组长-服务合规人员选择
$("#serPeo").click(function (e) {
    e.preventDefault();
    isTable = 2;
    type1 = "pendragon";
    getSelectCheck2();
    ID = $('#teamName').val();
    if (ID == null) {
        layer.msg("请选择所在部门", {time: 3000, icon: 0});
        return
    }
    $('#person-id, #person-name').val('');
    $('#match-peson-list').bootstrapTable('refreshOptions', {pageNumber: 1});
    chooseMatchPerson('#pendragon');
});

// 成员-服务合规人员选择
$("#serPeo1").click(function (e) {
    e.preventDefault();
    isTable = 3;
    type1 = "member";
    getSelectCheck2();
    ID = $('#teamName').val();
    if (ID == null) {
        layer.msg("请选择所在部门", {time: 3000, icon: 0});
        return
    }
    $('#person-id, #person-name').val('');
    $('#match-peson-list').bootstrapTable('refreshOptions', {pageNumber: 1});
    chooseMatchPerson('#member');
});

// 列席-服务合规人员选择
$("#serPeo2").click(function (e) {
    e.preventDefault();
    isTable = 4;
    type1 = "attend";
    getSelectCheck2();
    ID = $('#teamName').val();
    if (ID == null) {
        layer.msg("请选择所在部门", {time: 3000, icon: 0});
        return
    }
    $('#person-id, #person-name').val('');
    $('#match-peson-list').bootstrapTable('refreshOptions', {pageNumber: 1});
    chooseMatchPerson('#attend');
});

// 服务合规人员选择弹框
function chooseMatchPerson(id) {
    layer.open({
        type: 1,
        title: "人员选择",
        shift: 2,
        area: ['1000px', '435px'],
        btn: ['确定', '取消'],
        content: $("#add-match-person-items"),
        yes: function (index, layero) {
            var table = $(id);
            var s = id.substring(1, id.length);
            var tableData = []
            for (let i = 0; i < overAllIds.length; i++) {
                if (overAllIds[i].type == s) {
                    tableData.push(overAllIds[i])
                }
            }
            table.bootstrapTable('removeAll');
            table.bootstrapTable('append', tableData);
            layer.close(index);
            // var selectedPersons = $('#match-peson-list').bootstrapTable('getSelections');
            // var newItems = [];
            // selectedPersons.forEach(record => {
            //     var newItem = {};
            //     newItem.groupMemberBadge = record.username; // 工号
            //     newItem.groupMemberName = record.realname;  // 姓名
            //     newItem.duty = record.duty; // 职位名称
            //     newItem.groupMemberDuty = record.jobid; // 职位编码
            //     newItem.groupMemberType = isTable; // 类型：组长-1、副组长：2、成员：3
            //     newItem.groupItemId = record.groupItemId;
            //     newItems.push(newItem);
            // });
            // console.log('chooseMatchPerson-newItems', newItems);
            // if (selectedPersons.length > 0) {
            //     table.bootstrapTable('append', newItems);
            //     layer.close(index);
            // } else {
            //     layer.msg("请至少选择一条数据", {time: 3000, icon: 0});
            // }
        }
    });
}

// 新增页面组长列表信息获取
var TableInit1 = function (data) {
    var myTableInit = new Object();
    console.log(data)
    var headman = $('#headman');
    var table = new Array();
    for (var key in data) {
        if (data[key].groupMemberType == 1) {
            
            var val = {
                groupMemberName: data[key].groupMemberName,
                groupMemberBadge: data[key].groupMemberBadge,
                duty: data[key].duty,
                groupMemberDuty: data[key].groupMemberDuty,
                groupMemberType: data[key].groupMemberType,
                groupItemId: data[key].groupItemId
            }
            table.push(val)
            // 组长数据获取
            leader = data[key].groupMemberName
        }
    }
    $('#headman').bootstrapTable('append', table);

    myTableInit.Init = function () {
        headman.bootstrapTable({
            url: '',
            method: 'POST',
            locale: 'zh-CN',
            striped: false, // 是否显示行间隔色
            pagination: false, // 是否显示分页（*）
            sortable: true, // 是否启用排序
            sortOrder: "desc", // 排序方式
            paginationLoop: true,
            // sidePagination: "server", // 分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1, // 初始化加载第一页，默认第一页
            // pageSize: tableRelatedSetups.pageSize(),
            pageList: tableRelatedSetups.pageList(),
            strictSearch: true,
            clickToSelect: true, // 是否启用点击选中行
            uniqueId: "id", // 每一行的唯一标识，一般为主键列
            cardView: false, // 是否显示详细视图
            detailView: false, // 是否显示父子表
            pageSize: 10,
            onLoadSuccess: function (data) {
                console.log(data, "成功");
            },
            onLoadError: function (e) {
                console.log("数据加载失败！");
            },
            data: table,
            columns: [
                {
                    field: 'groupMemberName',
                    title: '姓名',
                }, {
                    field: 'groupMemberBadge',
                    title: '工号',
                }, {
                    field: 'duty',
                    title: '岗位名称',
                }, {
                    field: 'caozuo',
                    title: '操作',
                    events: operateEvent,
                    formatter: function () {
                        return [
                            '<a  href="#" class="delect1 dele" singleSelected=true>删除</a>',
                        ].join('');
                    } //自定义方法，添加删除按钮
                }
                , {
                    field: "groupMemberDuty",
                    title: 'ID',
                    visible: false
                },
                {
                    field: "groupMemberType",
                    visible: false
                }, {
                    field: "groupItemId",
                    visible: false
                }
            ]
        });
    }
    return myTableInit;
}

// 新增页面副组长列表信息获取
var TableInit2 = function (data) {
    var myTableInit = new Object();
    var pendragon = $('#pendragon');
    var table = new Array()
    for (let i in data) {
        if (data[i].groupMemberType == 2) {
            var val = {
                groupMemberName: data[i].groupMemberName,
                groupMemberBadge: data[i].groupMemberBadge,
                duty: data[i].duty,
                groupMemberDuty: data[i].groupMemberDuty,
                groupMemberType: data[i].groupMemberType,
                groupItemId: data[i].groupItemId
            }
            table.push(val)

        }
    }
    $('#pendragon').bootstrapTable('append', table);

    myTableInit.Init = function () {
        pendragon.bootstrapTable({
            url: '',
            method: 'POST',
            queryParams: function (params) {//传递给服务器的数据
                var json = {}
                return json;
            },
            locale: 'zh-CN',
            striped: false, // 是否显示行间隔色
            pagination: false, // 是否显示分页（*）
            sortable: true, // 是否启用排序
            sortOrder: "desc", // 排序方式
            paginationLoop: true,
            // sidePagination: "server", // 分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1, // 初始化加载第一页，默认第一页
            pageSize: tableRelatedSetups.pageSize(),
            pageList: tableRelatedSetups.pageList(),
            strictSearch: true,
            clickToSelect: true, // 是否启用点击选中行
            uniqueId: "id", // 每一行的唯一标识，一般为主键列
            cardView: false, // 是否显示详细视图
            detailView: false, // 是否显示父子表
            pageSize: 10,
            onLoadSuccess: function (data) {
                console.log(data, "成功");
            },
            onLoadError: function (e) {
                console.log("数据加载失败！");
            },
            data: table,
            columns: [
                {
                    field: 'groupMemberName',
                    title: '姓名',
                }, {
                    field: 'groupMemberBadge',
                    title: '工号',
                }, {
                    field: 'duty',
                    title: '岗位名称',
                }, {
                    field: 'caozuo',
                    title: '操作',
                    events: operateEvent,
                    formatter: function () {
                        return [
                            '<a  href="#" class="delect2 dele" singleSelected=true>删除</a>',
                        ].join('');
                    } //自定义方法，添加删除按钮
                }, {
                    field: "groupMemberDuty",
                    title: 'ID',
                    visible: false

                },
                {
                    field: "groupMemberType",
                    visible: false
                }, {
                    field: "groupItemId",
                    visible: false
                }
            ]
        });
    }
    return myTableInit;
}

// 新增页面成员列表信息获取
var TableInit3 = function (data) {
    var myTableInit = new Object();
    var member = $('#member');
    var table = new Array()
    table = []
    for (var key in data) {
        if (data[key].groupMemberType == 3 ||data[key].groupMemberType == 2 ||data[key].groupMemberType == 4) {
            var val = {
                groupMemberName: data[key].groupMemberName,
                groupMemberBadge: data[key].groupMemberBadge,
                duty: data[key].duty,
                groupMemberDuty: data[key].groupMemberDuty,
                groupMemberType: data[key].groupMemberType,
                groupItemId: data[key].groupItemId
            }
            table.push(val)
            // 导出成员的获取
            memberArr.push(data[key].groupMemberName)
            // 导出成员工号的获取
            memberArrNum.push(data[key].groupMemberBadge)
        }

    }
    $('#member').bootstrapTable('append', table);
    console.log(table, 'baocun3')

    myTableInit.Init = function () {
        member.bootstrapTable({
            url: '',
            method: 'POST',
            queryParams: function (params) {//传递给服务器的数据
                var json = {}
                return json;
            },
            locale: 'zh-CN',
            striped: false, // 是否显示行间隔色
            pagination: false, // 是否显示分页（*）
            sortable: true, // 是否启用排序
            sortOrder: "desc", // 排序方式
            paginationLoop: true,
            // sidePagination: "server", // 分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1, // 初始化加载第一页，默认第一页
            pageSize: tableRelatedSetups.pageSize(),
            pageList: tableRelatedSetups.pageList(),
            strictSearch: true,
            clickToSelect: true, // 是否启用点击选中行
            uniqueId: "id", // 每一行的唯一标识，一般为主键列
            cardView: false, // 是否显示详细视图
            detailView: false, // 是否显示父子表
            pageSize: 10,
            onLoadSuccess: function (data) {
                console.log(data, "成功");
            },
            onLoadError: function (e) {
                console.log("数据加载失败！");
            },
            data: table,
            columns: [
                {
                    field: 'groupMemberName',
                    title: '姓名'
                }, {
                    field: 'groupMemberBadge',
                    title: '工号',
                }, {
                    field: 'duty',
                    title: '岗位名称',
                }, {
                    field: 'caozuo',
                    title: '操作',
                    events: operateEvent,
                    formatter: function () {
                        return [
                            '<a  href="#" class="delect3 dele" singleSelected=true>删除</a>',
                        ].join('');
                    } //自定义方法，添加删除按钮
                }, {
                    field: "groupMemberType",
                    visible: false
                }, {
                    field: "groupMemberDuty",
                    visible: false

                }, {
                    field: "groupItemId",
                    visible: false
                }
            ]
        });
    }
    return myTableInit;
}

// 新增页面列席列表信息获取
let TableInit4 = function (data) {
    let myTableInit = new Object();
    let member = $('#attend');
    let table = new Array()
    table = []
    for (let key in data) {
        if (data[key].groupMemberType == 4) {
            let val = {
                groupMemberName: data[key].groupMemberName,
                groupMemberBadge: data[key].groupMemberBadge,
                duty: data[key].duty,
                groupMemberDuty: data[key].groupMemberDuty,
                groupMemberType: data[key].groupMemberType,
                groupItemId: data[key].groupItemId
            };
            table.push(val)
        }

    }
    $('#attend').bootstrapTable('load', table);

    myTableInit.Init = function () {
        member.bootstrapTable({
            url: '',
            method: 'POST',
            queryParams: function (params) {//传递给服务器的数据
                let json = {};
                return json;
            },
            striped: false, // 是否显示行间隔色
            pagination: false, // 是否显示分页（*）
            sortable: true, // 是否启用排序
            sortOrder: "desc", // 排序方式
            paginationLoop: true,
            sidePagination: "server", // 分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1, // 初始化加载第一页，默认第一页
            pageSize: tableRelatedSetups.pageSize(),
            pageList: tableRelatedSetups.pageList(),
            strictSearch: true,
            clickToSelect: true, // 是否启用点击选中行
            uniqueId: "id", // 每一行的唯一标识，一般为主键列
            cardView: false, // 是否显示详细视图
            detailView: false, // 是否显示父子表
            onLoadError: function (e) {
                layer.msg("加载列席信息失败", {time: 3000, icon: 2});
            },
            data: table,
            locale: 'zh-CN',
            columns: [
                {
                    field: 'groupMemberName',
                    title: '姓名'
                }, {
                    field: 'groupMemberBadge',
                    title: '工号',
                }, {
                    field: 'duty',
                    title: '岗位名称',
                }, {
                    field: 'caozuo',
                    title: '操作',
                    events: operateEvent,
                    formatter: function () {
                        return [
                            '<a  href="#" class="delect4 dele" singleSelected=true>删除</a>',
                        ].join('');
                    } //自定义方法，添加删除按钮
                }, {
                    field: "groupMemberType",
                    visible: false
                }, {
                    field: "groupMemberDuty",
                    visible: false

                }, {
                    field: "groupItemId",
                    visible: false
                }
            ]
        });
    };
    return myTableInit;
};

window.operateEvent = {
    // 新增页面-组长列表表内删除按钮逻辑
    'click .delect1': function (e, val, row, index) {
        e.preventDefault()
        var data = $('#headman').bootstrapTable('getData');
        let del = [data[index].groupMemberBadge];
        console.log($('#headman').bootstrapTable('getData'))
        $('#headman').bootstrapTable('remove', {
            field: 'groupMemberBadge',
            values: [data[index].groupMemberBadge]
        });
        console.log(data)
        type1 = "headman";
        let overAllIdsCopy = overAllIds.filter(item => del != item.groupMemberBadge || type1 != item.type);
        overAllIds = [].concat(overAllIdsCopy);
    },
    // 新增页面-副组长列表表内删除按钮逻辑
    'click .delect2': function (e, val, row, index) {
        e.preventDefault()
        var data = $('#pendragon').bootstrapTable('getData');
        let del = [data[index].groupMemberBadge];
        console.log($('#pendragon').bootstrapTable('getData'))
        $('#pendragon').bootstrapTable('remove', {
            field: 'groupMemberBadge',
            values: [data[index].groupMemberBadge]
        });
        console.log(data)
        type1 = "pendragon";
        let overAllIdsCopy = overAllIds.filter(item => {
            return del != item.groupMemberBadge || type1 != item.type
        });
        overAllIds = [].concat(overAllIdsCopy);
    },
    // 新增页面-成员列表表内删除按钮逻辑
    'click .delect3': function (e, val, row, index) {
        e.preventDefault()
        var data = $('#member').bootstrapTable('getData');
        let del = [data[index].groupMemberBadge];
        console.log($('#member').bootstrapTable('getData'))
        console.log('row', row, 'index', index);
        $('#member').bootstrapTable('remove', {
            field: 'groupMemberBadge',
            values: [data[index].groupMemberBadge]
        });
        // console.log(data)
        type1 = "member";
        let overAllIdsCopy = overAllIds.filter(item => del != item.groupMemberBadge || type1 != item.type);
        overAllIds = [].concat(overAllIdsCopy);
    },
    // 新增页面-列席列表表内删除按钮逻辑
    'click .delect4': function (e, val, row, index) {
        e.preventDefault()
        let data = $('#attend').bootstrapTable('getData');
        let del = [data[index].groupMemberBadge];
        $('#attend').bootstrapTable('remove', {
            field: 'groupMemberBadge',
            values: [data[index].groupMemberBadge]
        });
        type1 = "attend";
        let overAllIdsCopy = overAllIds.filter(item => del != item.groupMemberBadge || type1 != item.type);
        overAllIds = [].concat(overAllIdsCopy);
    }

};

// 新增页面组长列表点击选择按钮
$('#change1').click(function (e) {
    isTable = 1;
    type1 = "headman";
    e.preventDefault();
    if ($('#teamName').val() == null) {
        layer.msg("请选择所在部门", {time: 3000, icon: 0});
        return
    }
    $("#personName, #personBadge").val('');
    $('#pesonList').bootstrapTable('refreshOptions', {pageNumber: 1});
    getSelectCheck();
    personChoose('#headman');

});
// 新增页面组长列表点击选择业务人员按钮
$('#change2').click(function (e) {
    isTable = 2;
    type1 = "pendragon";
    e.preventDefault();
    if ($('#teamName').val() == null) {
        layer.msg("请选择所在部门", {time: 3000, icon: 0});
        return
    }
    $("#personName, #personBadge").val('');
    $('#pesonList').bootstrapTable('refreshOptions', {pageNumber: 1});
    getSelectCheck();
    personChoose('#pendragon');
});
// 新增页面组长列表点击选择服务合规人员按钮
$('#change3').click(function (e) {
    isTable = 3;
    type1 = "member";
    e.preventDefault();
    if ($('#teamName').val() == null) {
        layer.msg("请选择所在部门", {time: 3000, icon: 0});
        return
    }
    $("#personName, #personBadge").val('');
    $('#pesonList').bootstrapTable('refreshOptions', {pageNumber: 1});
    getSelectCheck();
    personChoose('#member');
});
// 新增页面列席列表点击选择业务人员按钮
$('#change4').click(function (e) {
    isTable = 4;
    type1 = "attend";
    e.preventDefault();
    if ($('#teamName').val() == null) {
        layer.msg("请选择所在部门", {time: 3000, icon: 0});
        return
    }
    $("#personName, #personBadge").val('');
    $('#pesonList').bootstrapTable('refreshOptions', {pageNumber: 1});
    getSelectCheck();
    personChoose('#attend');
});


// 判断所在部门是否存在决策领导小组
$("#teamName").change(function (e) {
    e.preventDefault();
    if (pageStatus === 'new') {
        launderMoney = 0
        $("#moneyTeam").val($("#teamName option:selected").text() + "决策领导小组")
        var data = $("#moneyTeam").val()
        console.log(data)
        // var data=$("#teamName option:selected").text()
        $.ajax({
            url: "/hgxn-platform/BaseGroupService/verifyGroupName",
            type: "POST",
            dataType: "text",
            contentType: 'application/json;charset=UTF-8',
            data: data,
            async: false,
            success: function (data) {
                const { msg } = JSON.parse(data);
                if (msg === '新的小组名称') {
                    launderMoney = 0
                } else {
                    launderMoney = 1
                    console.log('小组已存在')
                    layer.msg("本部门已经存在决策领导小组", {time: 3000, icon: 0});
                }
            },
            error: function () {
                launderMoney = 0
                console.log('小组未存在')

            }
        });
    }
});

// 详情页面-组长列表内容
var TableInit5 = function (data) {
    var myTableInit = new Object();
    var headmanDetails = $('#headmanDetails');
    var table = new Array()
    for (var key in data) {
        if (data[key].groupMemberType == 1) {
            // console.log(data[key],'1111111111111')
            var val = {
                groupMemberName: data[key].groupMemberName,
                groupMemberBadge: data[key].groupMemberBadge,
                duty: data[key].duty
            }
            table.push(val)
            // 用于存放组长
            leader = data[key].groupMemberName
            // console.log(table,'222222')
        }

    }
    $('#headmanDetails').bootstrapTable('append', table);
    myTableInit.Init = function () {
        headmanDetails.bootstrapTable({
            url: '',
            method: 'POST',
            locale: 'zh-CN',
            queryParams: function (params) {//传递给服务器的数据
                var json = {};
                return json;
            },
            striped: false, // 是否显示行间隔色
            pagination: false, // 是否显示分页（*）
            sortable: true, // 是否启用排序
            sortOrder: "desc", // 排序方式
            paginationLoop: true,
            // sidePagination: "server", // 分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1, // 初始化加载第一页，默认第一页
            pageSize: tableRelatedSetups.pageSize(),
            pageList: tableRelatedSetups.pageList(),
            strictSearch: true,
            clickToSelect: true, // 是否启用点击选中行
            uniqueId: "id", // 每一行的唯一标识，一般为主键列
            cardView: false, // 是否显示详细视图
            detailView: false, // 是否显示父子表
            pageSize: 10,
            onLoadSuccess: function (data) {
                console.log(data, "成功");
            },
            onLoadError: function (e) {
                console.log("数据加载失败！");
            },
            data: table,
            columns: [
                {
                    field: 'groupMemberName',
                    title: '姓名',
                }, {
                    field: 'groupMemberBadge',
                    title: '工号',
                }, {
                    field: 'duty',
                    title: '岗位名称',
                }
            ]
        });
    }
    return myTableInit;
}
// 详情页面-副组长列表内容
var TableInit6 = function (data) {
    var myTableInit = new Object();
    var pendragonDetails = $('#pendragonDetails');
    var table = new Array()
    for (var key in data) {
        // console.log(data[key],'1111111111111')
        if (data[key].groupMemberType == 2) {
            console.log(data[key], '1111111111111')
            var val = {
                groupMemberName: data[key].groupMemberName,
                groupMemberBadge: data[key].groupMemberBadge,
                duty: data[key].duty
            }
            table.push(val)
            // console.log(table,'222222')
        }
    }
    $('#pendragonDetails').bootstrapTable('append', table);
    myTableInit.Init = function () {
        pendragonDetails.bootstrapTable({
            url: '',
            method: 'POST',
            locale: 'zh-CN',
            queryParams: function (params) {//传递给服务器的数据
                var json = {}
                return json;
            },
            striped: false, // 是否显示行间隔色
            pagination: false, // 是否显示分页（*）
            sortable: true, // 是否启用排序
            sortOrder: "desc", // 排序方式
            paginationLoop: true,
            // sidePagination: "server", // 分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1, // 初始化加载第一页，默认第一页
            pageSize: tableRelatedSetups.pageSize(),
            pageList: tableRelatedSetups.pageList(),
            strictSearch: true,
            clickToSelect: true, // 是否启用点击选中行
            uniqueId: "id", // 每一行的唯一标识，一般为主键列
            cardView: false, // 是否显示详细视图
            detailView: false, // 是否显示父子表
            pageSize: 10,
            onLoadSuccess: function (data) {
                console.log(data, "成功");
            },
            onLoadError: function (e) {
                console.log("数据加载失败！");
            },
            data: table,
            columns: [
                {
                    field: 'groupMemberName',
                    title: '姓名',
                }, {
                    field: 'groupMemberBadge',
                    title: '工号',
                }, {
                    field: 'duty',
                    title: '岗位名称',
                }
            ]
        });
    }
    return myTableInit;
}
// 详情页面-成员列表内容
var TableInit7 = function (data) {
    var myTableInit = new Object();
    var memberDetails = $('#memberDetails');
    var table = new Array()
    for (var key in data) {
        // console.log(data[key],'1111111111111')
        if (data[key].groupMemberType == 3 || data[key].groupMemberType ==2 ||data[key].groupMemberType == 4) {
            console.log(data[key], '1111111111111')
            var val = {
                groupMemberName: data[key].groupMemberName,
                groupMemberBadge: data[key].groupMemberBadge,
                duty: data[key].duty
            }
            table.push(val)
            // 用于存放组员
            memberArr.push(data[key].groupMemberName)
            // 导出成员工号的获取
            memberArrNum.push(data[key].groupMemberBadge)
        }

    }
    $('#memberDetails').bootstrapTable('append', table);
    myTableInit.Init = function () {
        memberDetails.bootstrapTable({
            url: '',
            locale: 'zh-CN',
            method: 'POST',
            queryParams: function (params) {//传递给服务器的数据
                var json = {}
                return json;
            },
            striped: false, // 是否显示行间隔色
            pagination: false, // 是否显示分页（*）
            sortable: true, // 是否启用排序
            sortOrder: "desc", // 排序方式
            paginationLoop: true,
            // sidePagination: "server", // 分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1, // 初始化加载第一页，默认第一页
            pageSize: tableRelatedSetups.pageSize(),
            pageList: tableRelatedSetups.pageList(),
            strictSearch: true,
            clickToSelect: true, // 是否启用点击选中行
            uniqueId: "id", // 每一行的唯一标识，一般为主键列
            cardView: false, // 是否显示详细视图
            detailView: false, // 是否显示父子表
            pageSize: 10,
            onLoadSuccess: function (data) {
                console.log(data, "成功");
            },
            onLoadError: function (e) {
                console.log("数据加载失败！");
            },
            data: table,
            columns: [
                {
                    field: 'groupMemberName',
                    title: '姓名',
                }, {
                    field: 'groupMemberBadge',
                    title: '工号',
                }, {
                    field: 'duty',
                    title: '岗位名称',
                }
            ]
        });
    }
    return myTableInit;
}

// 详情页面-列席列表内容
let TableInit10 = function (data) {
    let myTableInit = new Object();
    let memberDetails = $('#attendDetails');
    let table = new Array();
    for (let key in data) {
        if (data[key].groupMemberType == 4) {
            let val = {
                groupMemberName: data[key].groupMemberName,
                groupMemberBadge: data[key].groupMemberBadge,
                duty: data[key].duty
            };
            table.push(val);
        }

    }
    $('#attendDetails').bootstrapTable('load', table);
    myTableInit.Init = function () {
        memberDetails.bootstrapTable({
            url: '',
            method: 'POST',
            queryParams: function (params) {//传递给服务器的数据
                let json = {}
                return json;
            },
            striped: false, // 是否显示行间隔色
            pagination: false, // 是否显示分页（*）
            sortable: true, // 是否启用排序
            sortOrder: "desc", // 排序方式
            paginationLoop: true,
            // sidePagination: "server", // 分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1, // 初始化加载第一页，默认第一页
            pageSize: tableRelatedSetups.pageSize(),
            pageList: tableRelatedSetups.pageList(),
            strictSearch: true,
            clickToSelect: true, // 是否启用点击选中行
            uniqueId: "id", // 每一行的唯一标识，一般为主键列
            cardView: false, // 是否显示详细视图
            detailView: false, // 是否显示父子表
            pageSize: 10,
            onLoadError: function (e) {
                layer.msg("加载列席信息失败", {time: 3000, icon: 2});
            },
            locale: 'zh-CN',
            data: table,
            columns: [
                {
                    field: 'groupMemberName',
                    title: '姓名',
                }, {
                    field: 'groupMemberBadge',
                    title: '工号',
                }, {
                    field: 'duty',
                    title: '岗位名称',
                }
            ]
        });
    };
    return myTableInit;
};

// 新增页面合规人员列表信息信息获取（第二个选择按钮）
var TableInit8 = function () {
    var myTableInit = new Object();
    myTableInit.Init = function () {
        $('#match-peson-list').bootstrapTable({
            locale: 'zh-CN',
            url: '/hgxn-platform/BaseGroupService/inquiryCompliancePersonnelByTeam',
            method: 'POST',
            pagination: true, // 是否显示分页（*）
            striped: false, // 是否显示行间隔色
            sortable: true, // 是否启用排序
            sortOrder: "desc", // 排序方式
            paginationLoop: true,
            sidePagination: "server", // 分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1, // 初始化加载第一页，默认第一页
            pageSize: tableRelatedSetups.pageSize(),
            pageList: tableRelatedSetups.pageList(),
            strictSearch: true,
            clickToSelect: true, // 是否启用点击选中行
            cardView: false, // 是否显示详细视图
            detailView: false, // 是否显示父子表
            queryParams: function (params) {
                return JSON.stringify({
                    name: $('#person-name').val(), //被模糊搜索的姓名
                    pageSize: (params.limit).toString(),  //一页显示几条数据
                    pageNum: ((params.offset / params.limit) + 1).toString(), //第几页(从1开始)
                    username: $('#person-id').val() //工号
                });
            },
            columns: [
                {
                    field: 'check',
                    checkbox: true,
                    formatter: function (i, row) { // 每次加载 checkbox 时判断当前 row 的 id 是否已经存在全局 Set() 里
                        for (let i = 0; i < overAllIds.length; i++) {
                            if (row.username == overAllIds[i].groupMemberBadge && type1 == overAllIds[i].type && row.jobid == overAllIds[i].groupMemberDuty) {
                                return {
                                    checked: true// 存在则选中
                                }
                                break;
                            }
                        }
                    }
                },
                {
                    field: 'username',
                    title: '人员工号',
                }, {
                    field: 'realname',
                    title: '人员姓名',
                }, {
                    field: 'department',
                    title: '主岗所在部门',
                }, {
                    field: 'isLeader',
                    title: '是否为团队长',
                }
            ]
        });
    };
    return myTableInit;
};

//回显选中的数据
function getSelectCheck2() {
    return overAllIds;
}

function examine2(type, datas) {
    if (type.indexOf('uncheck') == -1) {
        $.each(datas, function (i, v) {//v:表格行数据
            // 添加时，判断一行或多行的 id 是否已经在数组里 不存则添加　
            let flag = true;
            overAllIds.forEach(item => {
                if (v.username == item.groupMemberBadge && type1 == item.type && v.jobid == item.groupMemberDuty) {
                    flag = false;
                }
            })
            if (flag) {
                overAllIds.push({
                    groupMemberBadge: v.username, // 工号
                    groupMemberName: v.realname,  // 姓名
                    duty: v.duty, // 职位名称
                    groupMemberDuty: v.jobid, // 职位编码 TODO
                    groupMemberType: isTable, // 类型：组长：-1、副组长：2、成员：3 、列席：4 TODO
                    groupItemId: v.groupItemId,
                    type: type1
                })
            }

        });
    } else {
        $.each(datas, function (i, v) {
            overAllIds.forEach((item, index) => {
                if (v.username == item.groupMemberBadge && type1 == item.type) {
                    // flag = flase;
                    overAllIds.splice(index, 1)
                }
            })
        });
    }
}

$('#match-peson-list').on('uncheck.bs.table check.bs.table check-all.bs.table uncheck-all.bs.table', function (e, rows) {
    var datas = $.isArray(rows) ? rows : [rows]; // 点击时获取选中的行或取消选中的行
    examine2(e.type, datas); // 保存到全局 Array() 里
});

// 新增人员列表信息获取（第一个选择按钮）
var TableInit9 = function () {
    var myTableInit = new Object();
    myTableInit.Init = function () {
        $('#pesonList').bootstrapTable({
            locale: 'zh-CN',
            clickToSelect: true, // 是否启用点击选中行
            url: '/hgxn-platform/BaseGroupService/queryAllPersonnel',
            method: 'POST',
            clickToSelect: true, // 是否启用点击选中行
            pagination: true, // 是否显示分页（*）
            striped: false, // 是否显示行间隔色
            sortable: true, // 是否启用排序
            sortOrder: "desc", // 排序方式
            paginationLoop: true,
            sidePagination: "server", // 分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1, // 初始化加载第一页，默认第一页
            pageSize: tableRelatedSetups.pageSize(),
            pageList: tableRelatedSetups.pageList(),
            strictSearch: true,
            cardView: false, // 是否显示详细视图
            detailView: false, // 是否显示父子表
            queryParams: function (params) {
                // 添加判断，如果是空，说明按照原逻辑走
                if(presidHr==''){
                    return JSON.stringify([
                        (params.offset / params.limit).toString(),
                         (params.limit).toString(),
                          $('#teamName').val(), 
                          $('#personName').val(), 
                          $('#personBadge').val()]);
                }else{
                    return JSON.stringify([
                        (params.offset / params.limit).toString(),
                         (params.limit).toString(),
                        //   $('#teamName').val(), 
                            presidHr, 
                          $('#personName').val(), 
                          $('#personBadge').val()]);
                }
                
            },
            columns: [
                {
                    field: 'state',
                    checkbox: true,
                    formatter: function (i, row) { // 每次加载 checkbox 时判断当前 row 的 id 是否已经存在全局 Set() 里
                        for (let i = 0; i < overAllIds.length; i++) {
                            if (row.username == overAllIds[i].groupMemberBadge && type1 == overAllIds[i].type && row.jobid == overAllIds[i].groupMemberDuty) {
                                return {
                                    checked: true// 存在则选中
                                }
                                break;
                            }
                        }
                    }
                },
                {
                    field: 'username',
                    title: '编号',
                },
                {
                    field: 'realname',
                    title: '姓名',
                },
                {
                    field: 'duty',
                    title: '岗位名称',
                },
                {
                    field: 'department',
                    title: '部门名称',
                }

            ]
        });
    };
    return myTableInit;
};

//回显选中的数据
function getSelectCheck() {
    return overAllIds;
}

function examine(type, datas) {
    if (type.indexOf('uncheck') == -1) {
        $.each(datas, function (i, v) {//v:表格行数据
            // 添加时，判断一行或多行的 id 是否已经在数组里 不存则添加　
            let flag = true;
            overAllIds.forEach(item => {
                if (v.username == item.groupMemberBadge && type1 == item.type && v.jobid == item.groupMemberDuty) {
                    flag = false;
                }
            })
            if (flag) {
                overAllIds.push({
                    groupMemberBadge: v.username, // 工号
                    groupMemberName: v.realname,  // 姓名
                    duty: v.duty, // 职位名称
                    groupMemberDuty: v.jobid, // 职位编码 TODO
                    groupMemberType: isTable, // 类型：组长：-1、副组长：2、成员：3 、列席：4 TODO
                    groupItemId: v.groupItemId,
                    type: type1
                })
            }

        });
    } else {
        $.each(datas, function (i, v) {
            overAllIds.forEach((item, index) => {
                if (v.username == item.groupMemberBadge && type1 == item.type) {
                    // flag = flase;
                    overAllIds.splice(index, 1)
                }
            })
        });
    }
}

$('#pesonList').on('uncheck.bs.table check.bs.table check-all.bs.table uncheck-all.bs.table', function (e, rows) {
    var datas = $.isArray(rows) ? rows : [rows]; // 点击时获取选中的行或取消选中的行
    examine(e.type, datas); // 保存到全局 Array() 里
});


// 判断组长是否为空
function saveValue() {
    saveFlag = 0;
    delect = ''
    //判断 complaintContent是否为空
    var table1 = $("#headman").bootstrapTable('getData')
    console.log(table1)
    var table2 = $("#pendragon").bootstrapTable('getData')
    console.log(table2)
    var table3 = $("#member").bootstrapTable('getData')
    for (let i in table1) {
        groupMember1.push(table1[i].groupMemberBadge)
    }
    for (let i in table2) {
        groupMember2.push(table2[i].groupMemberBadge)
    }
    for (let i in table3) {
        groupMember3.push(table3[i].groupMemberBadge)
    }
    if (table1.length < 1) {
        delect = '请选择具体的小组人员'
        saveFlag = 1
        return
    }
    // if (table2.length < 1) {
    //     delect = '每类成员必须至少填写一个人'
    //     saveFlag = 1
    //     return
    //
    // }
    if (table3.length < 1) {
        delect = '请选择具体的小组人员'
        saveFlag = 1
        return

    }
    // console.log(compile,'')
}

// 判断是否有服务合规人
function people() {
    compile = 0
    var table2 = $("#pendragon").bootstrapTable('getData')
    console.log(table2)
    var table3 = $("#member").bootstrapTable('getData');
    let table4 = $("#attend").bootstrapTable('getData');
    // var data = "合规法律部"
    // $.ajax({
    //     type: "POST",
    //     contentType: 'application/json;charset=UTF-8',
    //     dataType: "json",
    //     data: data,
    //     async: false,
    //     url: "/hgxn-platform/OvwInterfaceDeptService/findDepartmentByName",
    //     success: function (data) {
    $.ajax({
        type: "POST",
        contentType: 'application/json;charset=UTF-8',
        dataType: "json",
        async: false,
        url: "/hgxn-platform/NotificationService/queryComplianceLawDeptPerson",
        success: function (data) {
            console.log(data, '判断是否有服务合规人')
            var data = data.data
            var array = []
            var num;
            for (let i in data) {
                array.push(data[i].userName)
            }
            var tableConcat = [].concat(table2).concat(table3).concat(table4).map(item => item.groupMemberBadge);
            var differences = _.differenceWith(array, tableConcat, _.isEqual);
            if (differences.length < array.length) compile = 1;
        },
        error: function (error) {
            console.log(error)
        }
    });
}

// 判断人员是否为3到9且为奇数
function peopleNum() {
    var table1 = $("#headman").bootstrapTable('getData')
    var table2 = $("#pendragon").bootstrapTable('getData')
    var table3 = $("#member").bootstrapTable('getData')
    var s = 0, j = 0, k = 0
    for (let i in table1) {
        s = Number(i) + Number(1)
    }
    //不需要j 
    // for (let i in table2) {
    //     j = Number(i) + Number(1)
    // }
    for (let i in table3) {
        k = Number(i) + Number(1)
    }
    peoNum = 0;
    if(( s + k ) % 2 && ( s + k ) >= 3){
        peoNum = 1
    }

}

// 判断人员是否重复
function repeat() {
    var headman = $("#headman").bootstrapTable("getData");
    var pendragon = $("#pendragon").bootstrapTable("getData");
    var member = $("#member").bootstrapTable("getData");
    let attend = $("#attend").bootstrapTable("getData");

    // 组长只能有一位
    if (headman.length > 1) {
        repeat1 = 1;
        return
    } else {
        repeat1 = 0;
    }
    // 组长、副组长、成员三种类型彼此之间不能重复
    // 组长、副组长、成员三种类型彼此之间不能重复
    const headmanIntersectionPendragon = _.intersectionBy(headman, pendragon, 'groupMemberBadge');
    const headmanIntersectionMember = _.intersectionBy(headman, member, 'groupMemberBadge');
    const headmanIntersectionAttend = _.intersectionBy(headman, attend, 'groupMemberBadge');
    const pendragonIntersectionMember = _.intersectionBy(pendragon, member, 'groupMemberBadge');
    const pendragonIntersectionAttend = _.intersectionBy(pendragon, attend, 'groupMemberBadge');
    const memberIntersectionAttend = _.intersectionBy(member, attend, 'groupMemberBadge');
    if (headmanIntersectionMember.length > 0 ) {
        headVal = 1;
        return
    } else {
        headVal = 0;
    }
    // 组长内、副组长内、成员内条目不能重复
    const uniqHeadman = _.uniqBy(headman, 'groupMemberBadge');
    const uniqPendragon = _.uniqBy(pendragon, 'groupMemberBadge');
    const uniqMember = _.uniqBy(member, 'groupMemberBadge');
    const uniqAttend = _.uniqBy(attend, 'groupMemberBadge');
    if (uniqHeadman.length < headman.length) {
        headmanIsRepeat = 1
        return
    } else {
        headmanIsRepeat = 0
    };
    if (uniqPendragon.length < pendragon.length) {
        pendragonIsRepeat = 1
        return
    } else {
        pendragonIsRepeat = 0
    };
    if (uniqMember.length < member.length) {
        memberIsRepeat = 1
        return
    } else {
        memberIsRepeat = 0
    };
    if (uniqAttend.length < attend.length) {
        attendIsRepeat = 1
        return
    } else {
        attendIsRepeat = 0
    }
    ;
}

// 点击保存
$('#saveInfor').on('click', function (e) {
    e.preventDefault()
    saveValue()
    people()
    peopleNum()
    repeat()
    if (saveFlag == 1) {
        layer.msg(delect, {time: 3000, icon: 0});
        return
    } else if (repeat1 != 0) {
        layer.msg('组长只能有一人', {time: 3000, icon: 0});
        return
    } else if (compile != 1) {
        layer.msg('小组人员中未包含部门服务合规人', {time: 3000, icon: 0});
        return
    } else if (headVal == 1) {
        layer.msg('组长和成员不能重复', {time: 3000, icon: 0});
    } else if (headmanIsRepeat == 1) {
        layer.msg('组长不能重复', {time: 3000, icon: 0});
        return
    } else if (pendragonIsRepeat == 1) {
        layer.msg('副组长不能重复', {time: 3000, icon: 0});
        return
    } else if (memberIsRepeat == 1) {
        layer.msg('成员不能重复', {time: 3000, icon: 0});
        return
    } else if (attendIsRepeat == 1) {
        layer.msg('列席不能重复', {time: 3000, icon: 0});
        return
    } else if (peoNum == 0) {
        layer.msg('小组人数必须大于等于3且为奇数', {time: 3000, icon: 0});
        return
    } else {
        var headman = $("#headman").bootstrapTable("getData")
        var pendragon = $("#pendragon").bootstrapTable("getData")
        var member = $("#member").bootstrapTable("getData")
        var attend = $("#attend").bootstrapTable("getData")
        var list = new Array()
        for (let i in headman) {
            list.push(headman[i])
        }
        for (let i in pendragon) {
            list.push(pendragon[i])
        }
        for (let i in member) {
            list.push(member[i])
        }
        for (let i in attend) {
            list.push(attend[i])
        }
        var data = {
            groupName: $("#moneyTeam").val(),
            deptName: $("#teamName option:selected").val(),
            deptNameStr: $("#teamName option:selected").text(),
            // 添加一个字段
            directlyUnder:$("#directlyUnder").is(":checked"),
            list: list,
            groupId,
            type: 2,
            removeTag: true,
        }
        $.ajax({
            url: "/hgxn-platform/BaseGroupService/saveBaseGroupHeader",
            type: "POST",
            dataType: "json",
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify(data),
            async: false,
            success: function (data) {
                const {success, msg} = data;
                if (!success) {
                    layer.msg(msg, {time: 3000, icon: 0});
                } else {
                    layer.msg("保存成功", {time: 3000, icon: 1});
                    queryShowTrainTable()
                }
            },
            error: function () {
                layer.msg("保存失败,请重新保存", {time: 3000, icon: 2});
                saveFlag = 0;
                e.preventDefault()
            }
        });
    }
})

// 点击取消/返回按钮按钮关闭当前页面
$('#closeWeb, .decision-manage-new .go-back').click(function (e) {
    pageStatus = '';
    layer.confirm('确定要退出吗？', {icon: 0, title: '提示'}, function (index) {
        queryShowTrainTable();
        layer.close(index);
    });
    e.preventDefault();
});
$('.decision-manage-detail .go-back').click(function () {
    pageStatus = '';
    queryShowTrainTable();
});

function queryShowTrainTable() {
    $('.panel-title').html('决策领导小组');
    $('.decision-manage-new, .decision-manage-detail').hide();
    // $("#lauderName, #lauderTeam").val("");
    $('.decision-manage-list').show();
    $('#Btndel').attr('disabled', true);
    $('#headman, #member, #pendragon, #headmanDetails, #pendragonDetails, #memberDetails').bootstrapTable('removeAll');
    // $("#lauderTable").bootstrapTable('refreshOptions', {pageNumber: 1});
}

function personChoose(id) {
    layer.open({
        type: 1,
        title: "人员选择",
        shift: 2,
        area: ['1000px', '435px'],
        btn: ['确定', '取消'],
        content: $("#add-person-items"),
        success: function (index, layero) {
            $('#pesonList').bootstrapTable('refreshOptions', {pageNumber: 1});
        },
        yes: function (index, layero) {
            var table = $(id);
            var s = id.substring(1, id.length);
            var tableData = []
            for (let i = 0; i < overAllIds.length; i++) {
                if (overAllIds[i].type == s) {
                    tableData.push(overAllIds[i])
                }
            }

            table.bootstrapTable('removeAll');
            table.bootstrapTable('append', tableData);
            layer.close(index);
            // let count = table.bootstrapTable('getData').length + 1;
            // var selectedPersons = $('#pesonList').bootstrapTable('getSelections');
            // var newItems = [];
            // selectedPersons.forEach(record => {
            //     var newItem = {};
            //     newItem.groupMemberBadge = record.username; // 工号
            //     newItem.groupMemberName = record.realname;  // 姓名
            //     newItem.duty = record.duty; // 职位名称
            //     newItem.groupMemberDuty = record.jobid; // 职位编码
            //     newItem.groupMemberType = isTable; // 类型：组长-1、副组长：2、成员：3
            //     newItem.groupItemId = record.groupItemId;
            //     console.log('newItem', newItem);
            //     newItems.push(newItem);
            // });
            // if (selectedPersons.length > 0) {
            //     table.bootstrapTable('append', newItems);
            //     layer.close(index);
            // } else {
            //     layer.msg("请至少选择一条数据", {time: 3000, icon: 0});
            // }
        }
    });
}
/**
 * 获取当前登陆人信息
 */
function getCurrentLoginUser() {
    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: "/hgxn-platform/PersonAssessService/seeLogerInfo",
        async: false,
        success: function (data) {
            loginNum = data.userName;
        },
        error: function (data) {}
    });
}
/**
 * 权限更改
 */
function permissionChange(data) {
    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: 'application/json',
        url: "/hgxn-platform/DeptAuthService/autoLoadDept",
        data: data,
        async: false,
        success: function (data) {
            if (data.code == 200) {
                if (data.data) {
                    loginUnitName = data.data.name
                }
            }
        },
    });
}
/**
 * 详情页导出按钮操作
 */
$('#exportBtn').off('click').on('click',function(){
    var myDate = new Date();
    var parentOrg
    // 调合规返回人员，得到合规人员heGuiArr数组集合
    returnPeople(memberArrNum)
    // 判断成员数组和合规数组（去重）
    for(var i = memberArr.length-1;i >= 0;i--){
        for(var j = 0;j < heGuiArr.length; j++){
            if(memberArr[i]==heGuiArr[j]){
                memberArr.remove(memberArr[i])
            }   
        }
    }
    // 把两个数组链接起来
    // console.log(memberArr.concat(heGuiArr))
    // 没值的话说明是分公司，取值空串
    if(presidHr == ''){
        parentOrg = ''
    }else{
        parentOrg = pname
    }
    var exportParma = {
        //.find('option:selected').text(),
        //营业部名称
        "org":$("#deptName").find('option:selected').text(),
        // 数字日期
        "year":myDate.getFullYear() + '',
        "month":myDate.getMonth() + 1 + '',
        "day":myDate.getDate() + '',
        // 中文日期
        "cy":change(myDate.getFullYear()),
        "cm":change(myDate.getMonth() + 1 ),
        "cd":change(myDate.getDate()),
        //分公司名称，如果本身为分公司，则取值为空
        "parentOrg":parentOrg,
        // 组长
        "leader":leader,
        // 组员
        "member": memberArr.concat(heGuiArr).join().replace(/,/g,'、')
    }
    // 置空返回合规人员数组
    heGuiArr = []
    var url = '/hgxn-platform/ExportTableService/downloadGroupChangeNotice'
    queryExport(exportParma,url)
})
// 数字变成中文
function change(data){
    var str =data.toString().split("")
    var obj1 = {'0':'零','1':'一','2':'二', '3':'三', '4':'四', '5':'五', '6':'六', '7':'七', '8':'八', '9':'九'}
    var obj2 = {'1':'一','2':'二', '3':'三', '4':'四', '5':'五', '6':'六', '7':'七', '8':'八', '9':'九',"10": "十","11":"十一","12":"十二","13":"十三","14":"十四","15":"十五","16":"十六","17":"十七","18":"十八","19":"十九","20":"二十","21":"二十一","22":"二十二","23":"二十三","24":"二十四","25":"二十五","26":"二十六","27":"二十七","28":"二十八","29":"二十九","30":"三十","31":"三十一"}
    if(str.length>2){//这是年
        var newYear = obj1[str[0]]+obj1[str[1]]+obj1[str[2]]+obj1[str[3]]
        return newYear
    }else{//或者是月份或者是日期
        var newStr = str.join('')
        var newDate  = obj2[newStr]
        return newDate
    }
}
// 编辑页导出按钮
$('#exportBtnUpData').off('click').on('click',function(){
    var myDate = new Date();
    var parentOrg
    // 调合规返回人员，得到合规人员heGuiArr数组集合
    returnPeople(memberArrNum)
    // 判断成员数组和合规数组（去重）
    for(var i = memberArr.length-1;i >= 0;i--){
        for(var j = 0;j < heGuiArr.length; j++){
            if(memberArr[i]==heGuiArr[j]){
                memberArr.remove(memberArr[i])
            }   
        }
    }
    // 没值的话说明是分公司，取值空串
    if(presidHr == ''){
        parentOrg = ''
    }else{
        parentOrg = pname
    }
    var exportParma = {
        //.find('option:selected').text(),
        //营业部名称
        "org":$("#deptName").find('option:selected').text(),
        // 数字日期
        "year":myDate.getFullYear() + '',
        "month":myDate.getMonth() + 1 + '',
        "day":myDate.getDate() + '',
        // 中文日期
        "cy":change(myDate.getFullYear()),
        "cm":change(myDate.getMonth() + 1 ),
        "cd":change(myDate.getDate()),
        //分公司名称，如果本身为分公司，则取值为空
        "parentOrg":parentOrg,
        // 组长
        "leader":leader,
        // 组员
        "member": memberArr.concat(heGuiArr).join().replace(/,/g,'、')
    }
     // 置空返回合规人员数组
    heGuiArr = []
    var url = '/hgxn-platform/ExportTableService/downloadGroupChangeNotice'
    queryExport(exportParma,url)
})

//  /hgxn-platform/BranchService/judgeComplianceDuty


// 导出之前调的接口
function returnPeople(value){
    $.ajax({
        url: '/hgxn-platform/BranchService/judgeComplianceDuty',
        data:JSON.stringify(value) ,
        contentType: 'application/json;charset=UTF-8',
        async: false,
        dataType: 'json',
        type: "POST",
        success: function (data) {
            if(data.code == 200){
                heGuiArr = data.data
                console.log(heGuiArr)
            }
        },
        error: function (error) {
            console.log('错误')
        }
    })
}
