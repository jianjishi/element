$(function () {
    // 返回列表
    $("#back").attr("href", window.parent.adminPath + "/device/adevice/index");
    var app = new Vue({
        el: "#app",
        data: {
            // 表格当前页数据
            tableData: [],
            // 多选数组
            ids: [],
            auditStatuss: [],
            //搜索条件
            criteria: {},

            brandList: brandList,
            deviceChipList: [],
            wifiList: wifiList,
            bluetoothList: bluetoothList,
            remoteControlList: remoteControlList,
            contentSourceList: contentSourceList,
            tvContentSourceSupportList: [],

            auditStatusList: auditStatusList,
            currentUserId: currentUserId,
            dictMap: dictMap,
            adeviceOutView: {},

            // 列表页
            searchForm: {
                model: '',
                chip: '',
                brand: '',
                contentSource: '',
                tvAndroidVersion: '',
                auditStatus: '',
                ram: []
            },

            // 详情页
            detailFormVisible: false,// 详情界面是否显示
            activeNames: ["basicAttr", "deviceChipInfo", "tvScreenInfo", "tvStorageInfo", "hardWareSupport", "peripheraInput", "softwareInfo", "soundImageInfo", "certificationInfo", "closeLoopInfo"],
            detailData: {
                tvIsCommercial: "",
                tvConditionCode: "",
                tvAndroidVersion: "",
                tvEnergyEfficiency: "",
                chipProvider: "",
                tvScreenResolution: "",
                tvIsOled: "",
                tvStorageEmmcSize: "",
                tvStorageEmmcType: "",
                tvStorageRamSize: "",
                tvStorageRamType: "",
                tvIsSupport2_4g: "",
                tvIntegratedMachine: "",
                tvUiResolution: "",
                tvHomePage: "",
                createBy: "",
                auditStatus: "",
                brandName: "",
                chipName: "",
                cpuInfo: "",
                gpuInfo: "",
                tvScreenSizeListStr: "",
                tvWifiModelName: "",
                tvSupport5g: "否",
                tvSupportRedian: "否",
                bluetoothModel: "",
                bluetoothVersion: "",
                remoteControlModel: "",
                isBluetoothRemoteControl: "",
                spdif: "无",
                tfCardSlot: "无",
                caCard: "无",
                sdCardSlot: "无",
                rj45: "无",
                rf_in: "无",
                contentSourceName: "",
                tvContentSourceSupportStr: "",
                tvGeneralSoftwareConfigListStr: "",
                tvSoundQualityListStr: "",
                tvImageQualityListStr: "",
                tvCertificationListStr: "",
                closeLoopVersion: ""
            },

            auditFormVisible: false,// 审核界面是否显示
            auditForm: {
                ids: [],
                auditStatus: 3,
                auditReason: ''
            },

            currentDeviceId: currentDeviceId,

            // 新增界面数据
            adeviceForm: {
                id: '',
                model: '',
                chip: '',
                brandId: '',
                tvIsCommercial: 0,
                tvConditionCode: '',
                androidVersionValue: '',
                tvEnergyEfficiencyValue: '',
                chipProviderValue: '',
                chipId: '',
                tvScreenSizeValues: [],
                tvScreenResolutionValue: '',
                tvIsOled: 0,
                tvStorageEmmcSizeValue: '',
                tvStorageEmmcTypeValue: '',
                tvStorageRamSizeValue: '',
                tvStorageRamTypeValue: '',
                wifiId: '',
                tvIsSupport2_4g: 0,
                bluetoothId: '',
                remoteControlId: '',
                tvIntegratedMachineValue: '',
                HDMI1_4: '0',
                HDMI2_0: '0',
                USB2_0: '0',
                USB3_0: '0',
                AV_in: '0',
                AV_out: '0',
                tvPeripheraInputCheckboxValues: [],
                tvUiResolutionValue: '',
                tvHomePageValue: '',
                contentSourceId: '',
                tvContentSourceSupportValues: [],
                tvGeneralSoftwareConfigValues: [],
                tvAdvanceSoftwareConfigValues: [],
                tvImageQualityValues: [],
                tvSoundQualityValues: [],
                tvCertificationValues: []
            },

            // 默认每页数据量:pageSize
            pageSize: 10,
            // 当前页码:pageNum
            currentPage: 1,
            // 查询的页码
            start: 1,
            // 默认数据总数
            totalCount: 1000,
        },
        methods: {
            // 从服务器读取数据
            loadData: function (criteria, currentPage, pageSize) {
                criteria['currentPage'] = currentPage;
                criteria['pageSize'] = pageSize;
                var rams = null;
                var ramStr = "";
                if (criteria["ram"] != null) {
                    rams = criteria["ram"];
                    for (var i = 0; i < rams.length; i++) {
                        ramStr += rams[i] + ","
                    }
                    ramStr = ramStr.substring(0, ramStr.length - 1)

                }
                this.$http({
                        method: 'GET',
                        url: 'get_adevices_json?',
                        data: {
                            currentPage: currentPage,
                            pageSize: pageSize,
                            ramStr: ramStr,
                            auditStatus: criteria['auditStatus'],
                            model: criteria['model'],
                            chip: criteria['chip'],
                            brand: criteria['brand'],
                            contentSource: criteria['contentSource'],
                            tvAndroidVersion: criteria['tvAndroidVersion']

                        }
                    }
                ).then(function (res) {
                    this.tableData = res.data.lists;
                    this.totalCount = res.data.count;
                }, function () {
                    console.log('failed');
                });


            },

            loadEditData: function () {
                var pageType = $("body").attr("page-type");
                var _this = this;
                this.$http.get("getEditParams", {id: this.currentDeviceId}).then(function (res) {
                    var status = res.data.status;
                    if (status != 0) {
                        var adevice = res.data.adeviceOutView;
                        console.log("adevice==>", adevice);
                        if (pageType == "edit") {
                            _this.adeviceForm.id = adevice.id;
                        } else {
                            _this.adeviceForm.id = '';
                        }
                        _this.adeviceForm.model = adevice.model;
                        _this.adeviceForm.chip = adevice.chip;
                        _this.adeviceForm.brandId = adevice.tvCurrentBrand.id == null ? '' : adevice.tvCurrentBrand.id;
                        _this.adeviceForm.tvIsCommercial = parseInt(adevice.tvIsCommercial.value);
                        _this.adeviceForm.tvConditionCode = adevice.tvConditionCode.value == null ? '' : adevice.tvConditionCode.value;
                        _this.adeviceForm.androidVersionValue = adevice.tvAndroidVersion.value == null ? '' : adevice.tvAndroidVersion.value;
                        _this.adeviceForm.tvEnergyEfficiencyValue = adevice.tvEnergyEfficiency.value == null ? '' : adevice.tvEnergyEfficiency.value;
                        _this.adeviceForm.chipProviderValue = adevice.chipProvider.value == null ? '' : adevice.chipProvider.value;
                        _this.$http.get("getChipName", {chipProvider: _this.adeviceForm.chipProviderValue}).then(function (res) {
                            // console.log(res.data);
                            if (res.data == null) {
                                _this.adeviceForm.chipId = "";
                            } else {
                                // console.log(res.data);
                                // console.log(adevice.tvCurrentDeviceChip.id);
                                _this.deviceChipList = res.data;
                                _this.adeviceForm.chipId = adevice.tvCurrentDeviceChip.id == null ? '' : parseInt(adevice.tvCurrentDeviceChip.id);
                            }
                        }, function () {
                            console.log('failed');
                        });
                        var tvScreenSizeList = adevice.tvScreenSize;
                        var tvScreenSizeValues = [];
                        for (var item in tvScreenSizeList) {
                            tvScreenSizeValues.push(tvScreenSizeList[item].value);
                        }
                        _this.adeviceForm.tvScreenSizeValues = tvScreenSizeValues;
                        _this.adeviceForm.tvScreenResolutionValue = adevice.tvScreenResolution.value == null ? '' : adevice.tvScreenResolution.value;
                        _this.adeviceForm.tvIsOled = parseInt(adevice.tvIsOled.value);
                        _this.adeviceForm.tvStorageEmmcSizeValue = adevice.tvStorageEmmcSize.value == null ? '' : adevice.tvStorageEmmcSize.value;
                        _this.adeviceForm.tvStorageEmmcTypeValue = adevice.tvStorageEmmcType.value == null ? '' : adevice.tvStorageEmmcType.value;
                        _this.adeviceForm.tvStorageRamSizeValue = adevice.tvStorageRamSize.value == null ? '' : adevice.tvStorageRamSize.value;
                        _this.adeviceForm.tvStorageRamTypeValue = adevice.tvStorageRamType.value == null ? '' : adevice.tvStorageRamType.value;
                        _this.adeviceForm.wifiId = adevice.tvCurrentWifi.id == null ? '' : adevice.tvCurrentWifi.id;
                        _this.adeviceForm.tvIsSupport2_4g = parseInt(adevice.tvIsSupport2_4g.value);
                        _this.adeviceForm.bluetoothId = adevice.tvCurrentBluetooth.id == null ? '' : adevice.tvCurrentBluetooth.id;
                        _this.adeviceForm.remoteControlId = adevice.tvCurrentRemoteControl.id == null ? '' : adevice.tvCurrentRemoteControl.id;
                        _this.adeviceForm.tvIntegratedMachineValue = adevice.tvIntegratedMachine.value == null ? '' : adevice.tvIntegratedMachine.value;
                        _this.adeviceForm.HDMI1_4 = adevice.hdmi1_4;
                        _this.adeviceForm.HDMI2_0 = adevice.hdmi2_0;
                        _this.adeviceForm.USB2_0 = adevice.usb2_0;
                        _this.adeviceForm.USB3_0 = adevice.usb3_0;
                        _this.adeviceForm.AV_in = adevice.av_in;
                        _this.adeviceForm.AV_out = adevice.av_out;
                        var tvPeripheraInputCheckboxList = adevice.tvPeripheraInputCheckbox;
                        var tvPeripheraInputCheckboxValues = [];
                        for (var item in tvPeripheraInputCheckboxList) {
                            tvPeripheraInputCheckboxValues.push(tvPeripheraInputCheckboxList[item].value);
                        }
                        _this.adeviceForm.tvPeripheraInputCheckboxValues = tvPeripheraInputCheckboxValues;
                        _this.adeviceForm.tvUiResolutionValue = adevice.tvUiResolution.value == null ? '' : adevice.tvUiResolution.value;
                        _this.adeviceForm.tvHomePageValue = adevice.tvHomePage.value == null ? '' : adevice.tvHomePage.value;
                        _this.adeviceForm.contentSourceId = adevice.tvCurrentContentSource.id == null ? '' : adevice.tvCurrentContentSource.id;
                        var tvContentSourceSupportList = adevice.tvContentSourceSupport;
                        var tvContentSourceSupportValues = [];
                        for (var item in tvContentSourceSupportList) {
                            tvContentSourceSupportValues.push(tvContentSourceSupportList[item].value);
                        }
                        _this.adeviceForm.tvContentSourceSupportValues = tvContentSourceSupportValues;
                        var tvGeneralSoftwareConfigList = adevice.tvGeneralSoftwareConfig;
                        var tvGeneralSoftwareConfigValues = [];
                        for (var item in tvGeneralSoftwareConfigList) {
                            tvGeneralSoftwareConfigValues.push(tvGeneralSoftwareConfigList[item].value);
                        }
                        _this.adeviceForm.tvGeneralSoftwareConfigValues = tvGeneralSoftwareConfigValues;
                        var tvAdvanceSoftwareConfigList = adevice.tvAdvanceSoftwareConfig;
                        var tvAdvanceSoftwareConfigValues = [];
                        for (var item in tvAdvanceSoftwareConfigList) {
                            tvAdvanceSoftwareConfigValues.push(tvAdvanceSoftwareConfigList[item].value);
                        }
                        _this.adeviceForm.tvAdvanceSoftwareConfigValues = tvAdvanceSoftwareConfigValues;
                        var tvImageQualityList = adevice.tvImageQuality;
                        var tvImageQualityValues = [];
                        for (var item in tvImageQualityList) {
                            tvImageQualityValues.push(tvImageQualityList[item].value);
                        }
                        _this.adeviceForm.tvImageQualityValues = tvImageQualityValues;
                        var tvSoundQualityList = adevice.tvSoundQuality;
                        var tvSoundQualityValues = [];
                        for (var item in tvSoundQualityList) {
                            tvSoundQualityValues.push(tvSoundQualityList[item].value);
                        }
                        _this.adeviceForm.tvSoundQualityValues = tvSoundQualityValues;
                        var tvCertificationList = adevice.tvCertification;
                        var tvCertificationValues = [];
                        for (var item in tvCertificationList) {
                            tvCertificationValues.push(tvCertificationList[item].value);
                        }
                        _this.adeviceForm.tvCertificationValues = tvCertificationValues;
                    }

                }, function () {
                    console.log('failed');
                });
            },

            // 每页显示数据量变更, 如每页显示10条变成每页显示20时,val=20
            handleSizeChange: function (val) {
                this.pageSize = val;
                this.loadData(this.criteria, this.currentPage, this.pageSize);
            },

            // 页码变更, 如第1页变成第2页时,val=2
            handleCurrentChange: function (val) {
                this.currentPage = val;
                this.loadData(this.criteria, this.currentPage, this.pageSize);
            },

            // 搜索,提交表单
            submitForm: function () { // todo: ram参数提交不了
                var _this = this;
                this.$refs.searchForm.validate(function (result) {
                    if (result) {
                        var searchFormParams = getSearchFormParams(_this);
                        _this.criteria = searchFormParams;
                        _this.loadData(_this.criteria, _this.currentPage, _this.pageSize)
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            // 刷新
            handleRefresh: function () {
                window.location.href = localStorage.getItem("adminPath") + "/device/adevice/index";
            },

            chipFilterTag(value, row) {
                return row.chip === value;
            },
            modelFilterTag(value, row) {
                return row.model === value;
            },
            auditStatusFilterTag(value, row) {
                return row.auditStatus === value;
            },

            handleCloseLoopVersionDetail: function (index, row) {
                //版本详情
                var id = row.id;
                console.log(id);
                layer.open({
                    type: 2,
                    title: '查看闭环软件',
                    area: ['90%', '85%'],
                    fixed: true,
                    content: localStorage.getItem("adminPath") + '/device/closeLoopSoftwareVersionHistory/index?adeviceId=' + id,
                    yes: function (index, layero) {
                        var formParams = $(layero).find("iframe")[0].contentWindow.getFormParams();
                    }, btn2: function (index, layero) {
                        layer.close(index);
                    },
                    cancel: function (index) {
                        layer.close(index);
                        loadData($("#example1"), "");
                    }
                });
            },

            handleCloseLoopVersionAdd: function (index, row) {
                var _this = this;
                var id = row.id;
                // console.log(id);
                layer.open({
                    type: 2,
                    title: '添加闭环软件',
                    area: ['90%', '85%'],
                    scrollbar: false,
                    content: localStorage.getItem("adminPath") + '/device/closeLoopSoftwareVersionHistory/addPage?adeviceId=' + id,
                    yes: function (index, layero) {
                        var formParams = $(layero).find("iframe")[0].contentWindow.getFormParams();
                    }, btn2: function (index, layero) {
                        layer.close(index);
                    },
                    cancel: function (index) {
                        layer.close(index);
                        _this.loadData(_this.criteria, _this.currentPage, _this.pageSize);
                    }
                });
            },

            // 详情
            handleDetail: function (index, row) {
                this.detailFormVisible = true;
                this.currentDeviceId = row.id;
                this.detailData.createBy = row.createBy;
                this.detailData.auditStatus = row.auditStatus;
                this.$http.get("detailPage", {id: row.id}).then(function (res) {
                    var adevice = res.data.adeviceOutView;
                    console.log(adevice);
                    this.adeviceOutView = adevice;
                    this.detailData.tvIsCommercial = adevice.tvIsCommercial.label;
                    this.detailData.tvConditionCode = adevice.tvConditionCode.label;
                    this.detailData.tvAndroidVersion = adevice.tvAndroidVersion.label;
                    this.detailData.tvEnergyEfficiency = adevice.tvEnergyEfficiency.label;
                    this.detailData.chipProvider = adevice.chipProvider.label;
                    this.detailData.tvScreenResolution = adevice.tvScreenResolution.label;
                    this.detailData.tvIsOled = adevice.tvIsOled.label;
                    this.detailData.tvStorageEmmcSize = adevice.tvStorageEmmcSize.label;
                    this.detailData.tvStorageEmmcType = adevice.tvStorageEmmcType.label;
                    this.detailData.tvStorageRamSize = adevice.tvStorageRamSize.label;
                    this.detailData.tvStorageRamType = adevice.tvStorageRamType.label;
                    this.detailData.tvIsSupport2_4g = adevice.tvIsSupport2_4g.label;
                    this.detailData.tvIntegratedMachine = adevice.tvIntegratedMachine.label;
                    this.detailData.tvUiResolution = adevice.tvUiResolution.label;
                    this.detailData.tvHomePage = adevice.tvHomePage.label;
                    this.detailData.brandName = adevice.tvCurrentBrand.name;
                    this.detailData.chipName = adevice.tvCurrentDeviceChip.chipName;
                    this.detailData.bluetoothModel = adevice.tvCurrentBluetooth.bluetoothModel;
                    this.detailData.bluetoothVersion = adevice.tvCurrentBluetooth.bluetoothVersion;
                    this.detailData.contentSourceName = adevice.tvCurrentContentSource.sName;
                    this.detailData.closeLoopVersion = adevice.tvCloseLoopVersion.coocaaVersion;
                    var cpuInfo = "";
                    var gpuInfo = "";
                    var deviceChip = adevice.tvCurrentDeviceChip;
                    if (deviceChip != null) {
                        this.detailData.cpuInfo = deviceChip.cpuModel + " " + deviceChip.cpuCore + " 核 " + deviceChip.cpuFrequency;
                        this.detailData.gpuInfo = deviceChip.gpuModel + " " + deviceChip.gpuCore + " 核 " + deviceChip.gpuFrequency;
                    }
                    var tvScreenSizeList = adevice.tvScreenSize;
                    if (tvScreenSizeList != null) {
                        var tvScreenSizeListStr = "";
                        for (var i = 0; i < tvScreenSizeList.length; i++) {
                            tvScreenSizeListStr += tvScreenSizeList[i].label;
                            if (i < tvScreenSizeList.length - 1) {
                                tvScreenSizeListStr += "、";
                            }
                        }
                        this.detailData.tvScreenSizeListStr = tvScreenSizeListStr;
                    }

                    //当前wifi
                    var wifi = adevice.tvCurrentWifi;
                    this.detailData.tvWifiModelName = wifi.modelName;
                    var wifiConfigList = wifi.wifiConfigList;
                    if (wifiConfigList != null && wifiConfigList.length > 0) {
                        for (var i = 0; i < wifiConfigList.length; i++) {
                            if (wifiConfigList[i].value == "tv_support_5g") {
                                this.detailData.tvSupport5g = "是";
                            }
                            if (wifiConfigList[i].value == "tv_support_redian") {
                                this.detailData.tvSupportRedian = "是";
                            }
                        }
                    }

                    //遥控器
                    var remoteControl = adevice.tvCurrentRemoteControl;
                    if (remoteControl != null) {
                        this.detailData.remoteControlModel = remoteControl.remoteControlModel;
                        if (remoteControl.isBluetoothRemoteControl != null) {
                            if (remoteControl.isBluetoothRemoteControl == 1) {
                                this.detailData.isBluetoothRemoteControl = "是"
                            }

                            if (remoteControl.isBluetoothRemoteControl == 0) {
                                this.detailData.isBluetoothRemoteControl = "否"
                            }
                        }
                    }
                    var peripheraList = adevice.tvPeripheraInputCheckbox;
                    if (peripheraList != null && peripheraList.length > 0) {
                        for (var i = 0; i < peripheraList.length; i++) {
                            if (peripheraList[i].value == "spdif") {
                                this.detailData.spdif = "有";
                            }
                            if (peripheraList[i].value == "tf_card_slot") {
                                this.detailData.tfCardSlot = "有";
                            }
                            if (peripheraList[i].value == "ca_card") {
                                this.detailData.caCard = "有";
                            }
                            if (peripheraList[i].value == "rj45") {
                                this.detailData.rj45 = "有";
                            }
                            if (peripheraList[i].value == "rf_in") {
                                this.detailData.rf_in = "有";
                            }

                        }
                    }

                    //内容源支持项
                    var tvContentSourceSupportList = adevice.tvContentSourceSupport;
                    if (tvContentSourceSupportList != null) {
                        var tvContentSourceSupportStr = "";
                        for (var i = 0; i < tvContentSourceSupportList.length; i++) {
                            tvContentSourceSupportStr += tvContentSourceSupportList[i].label;
                            if (i < tvContentSourceSupportList.length - 1) {
                                tvContentSourceSupportStr += "、";
                            }
                        }
                        this.detailData.tvContentSourceSupportStr = tvContentSourceSupportStr;
                    }

                    //通用软件配置
                    var tvGeneralSoftwareConfigList = adevice.tvGeneralSoftwareConfig;
                    if (tvGeneralSoftwareConfigList != null) {
                        var tvGeneralSoftwareConfigListStr = "";
                        for (var i = 0; i < tvGeneralSoftwareConfigList.length; i++) {
                            tvGeneralSoftwareConfigListStr += tvGeneralSoftwareConfigList[i].label;
                            if (i < tvGeneralSoftwareConfigList.length - 1) {
                                tvGeneralSoftwareConfigListStr += "、";
                            }
                        }
                        this.detailData.tvGeneralSoftwareConfigListStr = tvGeneralSoftwareConfigListStr;
                    }

                    //音质
                    var tvSoundQualityList = adevice.tvSoundQuality;
                    if (tvSoundQualityList != null) {
                        var tvSoundQualityListStr = "";
                        for (var i = 0; i < tvSoundQualityList.length; i++) {
                            tvSoundQualityListStr += tvSoundQualityList[i].label;
                            if (i < tvSoundQualityList.length - 1) {
                                tvSoundQualityListStr += "、";
                            }
                        }
                        this.detailData.tvSoundQualityListStr = tvSoundQualityListStr;
                    }

                    //画质
                    var tvImageQualityList = adevice.tvImageQuality;
                    if (tvImageQualityList != null) {
                        var tvImageQualityListStr = "";
                        for (var i = 0; i < tvImageQualityList.length; i++) {
                            tvImageQualityListStr += tvImageQualityList[i].label;
                            if (i < tvImageQualityList.length - 1) {
                                tvImageQualityListStr += "、";
                            }
                        }
                        this.detailData.tvImageQualityListStr = tvImageQualityListStr;
                    }

                    //认证信息
                    var tvCertificationList = adevice.tvCertification;
                    if (tvCertificationList != null) {
                        var tvCertificationListStr = "";
                        for (var i = 0; i < tvCertificationList.length; i++) {
                            tvCertificationListStr += tvCertificationList[i].label;
                            if (i < tvCertificationList.length - 1) {
                                tvCertificationListStr += "、";
                            }
                        }
                        this.detailData.tvCertificationListStr = tvCertificationListStr;
                    }


                }, function () {
                    console.log('failed');
                });
            },

            // 是否是商用机,若是,则显示特征码,反之,不显现
            ifOrNotCommercial: function () {
                if (this.adeviceForm.tvIsCommercial == 1) {
                    $(".tvConditionCode").removeClass("hidden");
                } else {
                    $(".tvConditionCode").addClass("hidden");
                }
            },

            // 更改芯片商, 动态去获取该芯片商所拥有的芯片型号
            changeChipProvider: function (value) {
                this.adeviceForm.chipId = "";
                this.$http.get("getChipName", {chipProvider: value}).then(function (res) {
                    // console.log(res.data);
                    this.deviceChipList = res.data;
                }, function () {
                    console.log('failed');
                });
            },

            // 更改芯片型号,右侧出来对应的描述信息
            changeDeviceChip: function (value) {
                $("#deviceChipDesc").text();
                var deviceChipList = this.deviceChipList;
                for (var i = 0; i < deviceChipList.length; i++) {
                    if (deviceChipList[i].id == value) {
                        var cpuInfo = "CPU信息:" + deviceChipList[i].cpuModel + "、" + deviceChipList[i].cpuCore + "核、" + deviceChipList[i].cpuFrequency;
                        var gpuInfo = "GPU信息:" + deviceChipList[i].gpuModel + "、" + deviceChipList[i].gpuCore + "核、" + deviceChipList[i].gpuFrequency;
                        $("#deviceChipDesc").text(cpuInfo + "," + gpuInfo);
                    }
                }
            },

            // 更改wifi型号,右侧出来对应的描述信息
            changeWifi: function (value) {
                $("#wifiDesc").text();
                var wifiList = this.wifiList;
                for (var i = 0; i < wifiList.length; i++) {
                    if (wifiList[i].id == value) {
                        var wifiConfigList = wifiList[i].wifiConfigList;
                        var desc = "";
                        if (wifiConfigList != null) {
                            if (wifiConfigList.length == 0) {
                                desc = "不支持5g, 不支持热点";
                            } else if (wifiConfigList.length == 1) {
                                if (wifiConfigList[0].value == "tv_support_5g") {
                                    desc = "支持5g, 不支持热点";
                                } else {
                                    desc = "不支持5g, 支持热点";
                                }
                            } else {
                                desc = "支持5g, 支持热点";
                            }
                        } else {
                            desc = "不支持5g, 不支持热点";
                        }
                        $("#wifiDesc").text(desc);
                        break;
                    }
                }
            },

            // 更改蓝牙型号,右侧出来是否是蓝牙遥控器
            changeBluetooth: function (value) {
                $("#bluetoothDesc").text();
                var bluetoothList = this.bluetoothList;
                for (var i = 0; i < bluetoothList.length; i++) {
                    if (bluetoothList[i].id == value) {
                        var desc = "蓝牙版本:" + bluetoothList[i].bluetoothVersion;
                        $("#bluetoothDesc").text(desc);
                        break;
                    }
                }
            },

            // 更改遥控器型号,右侧出来对应的蓝牙版本信息
            changeRemoteControl: function (value) {
                $("#remoteControlDesc").text();
                var remoteControlList = this.remoteControlList;
                for (var i = 0; i < remoteControlList.length; i++) {
                    if (remoteControlList[i].id == value) {
                        var desc = "蓝牙遥控器:";
                        desc += remoteControlList[i].isBluetoothRemoteControl == 1 ? "是" : "否";
                        $("#remoteControlDesc").text(desc);
                        break;
                    }
                }
            },

            // 更改内容源,下方出现内容源支持项复选项
            changeContentSource: function (value) {
                $(".tvContentSourceSupports").removeClass("hidden");
                var contentSourceId = value;
                this.$http.get("getContentSourceSupportList", {contentSourceId: contentSourceId}).then(function (res) {
                    // console.log(res.data);
                    this.tvContentSourceSupportList = res.data;
                }, function () {
                    console.log('failed');
                });
            },

            // 新增
            handleAdd: function (index, row) {
                var adevice = this.adeviceForm;
                for (var item in adevice) {
                    if (item == "tvScreenSizeValues" || item == "tvPeripheraInputCheckboxValues" ||
                        item == "tvContentSourceSupportValues" || item == "tvGeneralSoftwareConfigValues" ||
                        item == "tvAdvanceSoftwareConfigValues" || item == "tvImageQualityValues" ||
                        item == "tvSoundQualityValues" || item == "tvCertificationValues") {
                        adevice[item] = [];
                    } else if (item == "tvIsCommercial" || item == "tvIsOled" || item == "tvIsSupport2_4g") {
                        adevice[item] = 0;
                    } else if (item == "HDMI1_4" || item == "HDMI2_0" || item == "USB2_0" || item == "USB3_0" ||
                        item == "AV_in" || item == "AV_out") {
                        adevice[item] = '0';
                    } else {
                        adevice[item] = '';
                    }
                }
                window.location.href = "addPage";
            },

            // 保存草稿
            saveDraft: function () {
                var _this = this;
                var flag = true;
                var model = _this.adeviceForm.model, chip = _this.adeviceForm.chip;
                if (model == "" || chip == "") {
                    _this.$alert("最基本的机型机芯必须填写", '提示', {
                        confirmButtonText: '确定',
                    });
                    flag = false;
                }
                if (flag) {
                    var addFormParams = getFormParams(_this) + "&auditStatus=1";
                    // console.log(addFormParams);
                    add(_this, addFormParams);
                }
            },

            // 提交审核
            pendingApproval: function () {
                var _this = this;
                this.$refs.adeviceForm.validate((valid) => {
                    if (valid) {
                        var flag = true;
                        var tvIsCommercial = _this.adeviceForm.tvIsCommercial,
                            tvConditionCode = _this.adeviceForm.tvConditionCode;
                        if (tvIsCommercial == 1) {
                            if (tvConditionCode == "") {
                                _this.$alert("请填写特征码", '提示', {
                                    confirmButtonText: '确定',
                                });
                                flag = false;
                            }
                        }
                        if (flag) {
                            var addFormParams = getFormParams(_this) + "&auditStatus=2";
                            // console.log(addFormParams);
                            pendingAudit(_this, addFormParams);
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            // 编辑
            handleEdit: function (id) {
                window.location.href = "editPage?id=" + id;
            },

            // 送审
            handlePendingAudit: function (id) {
                var pendingAuditParams = "id=" + id;
                submitForCensorship(this, pendingAuditParams);
            },

            // 审核
            handleAudit: function (id) {
                this.auditFormVisible = true;
                this.auditForm.ids = [id];
                this.auditForm.auditStatus = 3;
                this.auditForm.auditReason = '';
            },

            // 批量审核
            handleBatchAudit: function () {
                var flag = true;
                var ids = this.ids;
                var auditStatuss = this.auditStatuss;
                if (ids.length == 0) {
                    this.$alert('请至少勾选一条记录', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning'
                    });
                    flag = false;
                }
                if ($.inArray(1, auditStatuss) != -1 || $.inArray(3, auditStatuss) != -1 || $.inArray(4, auditStatuss) != -1) {
                    this.$alert('请确保勾选项中全部都是待审核状态', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning'
                    });
                    flag = false;
                }
                if (flag) {
                    this.auditFormVisible = true;
                    this.auditForm.ids = ids;
                    this.auditForm.auditStatus = 3;
                    this.auditForm.auditReason = '';
                }

            },

            // 取消审核
            cancelAudit: function () {
                this.auditFormVisible = false;
                this.$message({
                    showClose: true,
                    message: '已取消审核'
                });
            },

            // 审核
            auditSubmit: function () {
                var _this = this;
                this.$refs.auditForm.validate((valid) => {
                    if (valid) {
                        var auditFormParams = getAuditFormParams(_this, _this.auditForm.ids);
                        audit(_this, auditFormParams);
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            // 撤销审核
            handleRevokeAudit: function (id) {
                var formParams = "id=" + id;
                this.$confirm('确定要撤销审核该条记录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    revokeAudit(this, formParams);
                }).catch(() => {
                    this.$message({
                        showClose: true,
                        message: '已取消撤销审核操作'
                    });
                });
            },

            // 创建副本
            handleCreateCopy: function (id) {
                window.location.href = "createCopyPage?id=" + id;
            },

            handleExportExcel: function () {
                var formParams = getSearchFormParams(this);
                var ramStr = "";
                if (formParams["ram"] != null) {
                    var rams = formParams["ram"];
                    for (var i = 0; i < rams.length; i++) {
                        ramStr += rams[i] + ","
                    }
                    ramStr = ramStr.substring(0, ramStr.length - 1)

                }
                formParams["ramStr"] = formParams["ramStr"];

                console.log(formParams);
                this.$confirm('确定要导出这些记录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    exportExcel(this, formParams);
                }).catch(() => {
                    this.$message({
                        showClose: true,
                        message: '已取消导出Excel操作'
                    });
                });
            },

            // 取消
            cancelDetail: function () {
                this.detailFormVisible = false;
                this.$message({
                    showClose: true,
                    message: '已取消查看详情'
                });
            },

            // 单行删除
            handleDelete: function (id) {
                this.$confirm('确定要删除该条记录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    del(this, id);
                }).catch(() => {
                    this.$message({
                        showClose: true,
                        message: '已取消删除操作'
                    });
                });
            },

            // 多选响应
            handleSelectionChange: function (val) {
                // 循环该数组,取出id放到(push)multipleSelection
                var ids = [], auditStatuss = [];
                for (var i = 0; i < val.length; i++) {
                    ids.push(val[i].id);
                    auditStatuss.push(val[i].auditStatus);
                }
                this.ids = ids;
                this.auditStatuss = auditStatuss;
            },

            // 批量删除
            handleBatchDel: function () {
                var ids = this.ids;
                if (ids.length > 0) {
                    this.$confirm('确定要删除这批记录?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                        batchdel(this, ids);
                    }).catch(() => {
                        this.$message({
                            showClose: true,
                            message: '已取消删除操作'
                        });
                    });
                } else {
                    this.$alert('请至少勾选一条记录', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning'
                    });
                }
            }
        }
    });
    //载入数据
    app.loadData(app.criteria, app.currentPage, app.pageSize);
    app.loadEditData();

});

function getSearchFormParams(_this) {
    debugger;
    var q = {};
    var formData = _this.searchForm;
    for (var item in formData) {
        q[item] = formData[item];
    }
    return q;
}
function getAuditFormParams(_this, ids) {
    var q = "";
    var formData = _this.auditForm;
    for (var item in formData) {
        q += item + "=" + formData[item] + "&";
    }
    q = q.substring(0, q.length - 1);
    return q;
}
function submitForCensorship(_this, formParams) {
    $.post("submitForCensorship", formParams, function (a, b) {
        if (a == true) {
            _this.$notify({
                title: '成功',
                message: '恭喜您, 送审成功',
                type: 'success'
            });
            _this.detailFormVisible = false;
            _this.loadData(_this.criteria, _this.currentPage, _this.pageSize);
        } else {
            _this.$alert(a.msg, '提示', {
                confirmButtonText: '确定',
            });
            return false;
        }
    }).fail(function (jhr) {
        console.log(jhr);
        _this.$alert('送审失败', '提示', {
            confirmButtonText: '确定',
        });
    });
}
function audit(_this, formParams) {
    $.post("audit", formParams, function (a, b) {
        if (a == true) {
            _this.$notify({
                title: '成功',
                message: '恭喜您, 审核成功',
                type: 'success'
            });
            _this.detailFormVisible = false;
            _this.auditFormVisible = false;
            _this.loadData(_this.criteria, _this.currentPage, _this.pageSize);
        } else {
            _this.$alert(a.msg, '提示', {
                confirmButtonText: '确定',
            });
            return false;
        }
    }).fail(function (jhr) {
        console.log(jhr);
        _this.$alert('审核失败', '提示', {
            confirmButtonText: '确定',
        });
    });
}
function revokeAudit(_this, formParams) {
    $.post("revokeAudit", formParams, function (a, b) {
        if (a == true) {
            _this.$notify({
                title: '成功',
                message: '恭喜您, 撤销审核成功',
                type: 'success'
            });
            _this.detailFormVisible = false;
            _this.loadData(_this.criteria, _this.currentPage, _this.pageSize);
        } else {
            layer.alert(a.msg);
            return false;
        }
    }).fail(function (jhr) {
        console.log(jhr);
        layer.alert('撤销审核失败');
    });
}
function del(_this, id) {
    $.post("del", {id: id}, function (a, b) {
        if (a == true) {
            _this.$notify({
                title: '成功',
                message: '恭喜您, 已删除成功',
                type: 'success'
            });
            _this.detailFormVisible = false;
            _this.loadData(_this.criteria, _this.currentPage, _this.pageSize);
        } else {
            _this.$alert(a.msg, '提示', {
                confirmButtonText: '确定',
            });
            return false;
        }
    }).fail(function (jhr) {
        console.log(jhr);
        _this.$alert('删除失败', '提示', {
            confirmButtonText: '确定',
        });
    });
}
function exportExcel(_this, formParams) {
    $.post("exportExcel", formParams, function (a, b) {
        if (a.status == 1) {
            _this.$notify({
                title: '成功',
                message: '恭喜您, 已导出成功',
                type: 'success',
                onClose: function () {
                    window.location.href = a.download;
                }
            });
        } else {
            _this.$alert(a.msg, '提示', {
                confirmButtonText: '确定',
            });
            return false;
        }
    }).fail(function (jhr) {
        console.log(jhr);
        _this.$alert('删除失败', '提示', {
            confirmButtonText: '确定',
        });
    });
}

function getFormParams(_this) {
    var q = "";
    var formData = _this.adeviceForm;
    for (var item in formData) {
        q += item + "=" + formData[item] + "&";
        if (item == "brandId") {
            for (var i = 0; i < brandList.length; i++) {
                if (brandList[i].id == formData[item]) {
                    var brandName = brandList[i].name;
                    q += "brandName=" + brandName + "&";
                    break;
                }
            }
        }
        if (item == "androidVersionValue") {
            var tvAndroidVersionList = _this.dictMap.tv_android_version;
            for (var i = 0; i < tvAndroidVersionList.length; i++) {
                if (tvAndroidVersionList[i].value == formData[item]) {
                    var androidVersionLabel = tvAndroidVersionList[i].label;
                    q += "androidVersionLabel=" + androidVersionLabel + "&";
                    break;
                }
            }
        }
        if (item == "tvEnergyEfficiencyValue") {
            var tvEnergyEfficiencyList = _this.dictMap.tv_energy_efficiency;
            for (var i = 0; i < tvEnergyEfficiencyList.length; i++) {
                if (tvEnergyEfficiencyList[i].value == formData[item]) {
                    var tvEnergyEfficiencyLabel = tvEnergyEfficiencyList[i].label;
                    q += "tvEnergyEfficiencyLabel=" + tvEnergyEfficiencyLabel + "&";
                    break;
                }
            }
        }
        if (item == "chipProviderValue") {
            var chipProviderList = _this.dictMap.chip_provider;
            for (var i = 0; i < chipProviderList.length; i++) {
                if (chipProviderList[i].value == formData[item]) {
                    var chipProviderLabel = chipProviderList[i].label;
                    q += "chipProviderLabel=" + chipProviderLabel + "&";
                    break;
                }
            }
        }
        if (item == "chipId") {
            var deviceChipList = _this.deviceChipList;
            for (var i = 0; i < deviceChipList.length; i++) {
                if (deviceChipList[i].id == formData[item]) {
                    var chipName = deviceChipList[i].chipName;
                    q += "chipName=" + chipName + "&";
                    break;
                }
            }
        }
        if (item == "tvScreenSizeValues") {
            var tvScreenSizeList = dictMap.tv_screen_size;
            var tvScreenSizeLabels = [];
            for (var i = 0; i < tvScreenSizeList.length; i++) {
                if (formData[item].indexOf(tvScreenSizeList[i].value) != -1) {
                    tvScreenSizeLabels.push(tvScreenSizeList[i].label);
                }
            }
            q += "tvScreenSizeLabels=" + tvScreenSizeLabels + "&";
        }
        if (item == "tvScreenResolutionValue") {
            var tvScreenResolutionList = _this.dictMap.tv_screen_resolution;
            for (var i = 0; i < tvScreenResolutionList.length; i++) {
                if (tvScreenResolutionList[i].value == formData[item]) {
                    var tvScreenResolutionLabel = tvScreenResolutionList[i].label;
                    q += "tvScreenResolutionLabel=" + tvScreenResolutionLabel + "&";
                    break;
                }
            }
        }
        if (item == "tvStorageEmmcSizeValue") {
            var tvStorageEmmcSizeList = _this.dictMap.tv_storage_emmc_size;
            for (var i = 0; i < tvStorageEmmcSizeList.length; i++) {
                if (tvStorageEmmcSizeList[i].value == formData[item]) {
                    var tvStorageEmmcSizeLabel = tvStorageEmmcSizeList[i].label;
                    q += "tvStorageEmmcSizeLabel=" + tvStorageEmmcSizeLabel + "&";
                    break;
                }
            }
        }
        if (item == "tvStorageEmmcTypeValue") {
            var tvStorageEmmcTypeList = _this.dictMap.tv_storage_emmc_type;
            for (var i = 0; i < tvStorageEmmcTypeList.length; i++) {
                if (tvStorageEmmcTypeList[i].value == formData[item]) {
                    var tvStorageEmmcTypeLabel = tvStorageEmmcTypeList[i].label;
                    q += "tvStorageEmmcTypeLabel=" + tvStorageEmmcTypeLabel + "&";
                    break;
                }
            }
        }
        if (item == "tvStorageRamSizeValue") {
            var tvStorageRamSizeList = _this.dictMap.tv_storage_ram_size;
            for (var i = 0; i < tvStorageRamSizeList.length; i++) {
                if (tvStorageRamSizeList[i].value == formData[item]) {
                    var tvStorageRamSizeLabel = tvStorageRamSizeList[i].label;
                    q += "tvStorageRamSizeLabel=" + tvStorageRamSizeLabel + "&";
                    break;
                }
            }
        }
        if (item == "tvStorageRamTypeValue") {
            var tvStorageRamTypeList = _this.dictMap.tv_storage_ram_type;
            for (var i = 0; i < tvStorageRamTypeList.length; i++) {
                if (tvStorageRamTypeList[i].value == formData[item]) {
                    var tvStorageRamTypeLabel = tvStorageRamTypeList[i].label;
                    q += "tvStorageRamTypeLabel=" + tvStorageRamTypeLabel + "&";
                    break;
                }
            }
        }
        if (item == "wifiId") {
            for (var i = 0; i < wifiList.length; i++) {
                if (wifiList[i].id == formData[item]) {
                    var wifiModelName = wifiList[i].modelName;
                    q += "wifiModelName=" + wifiModelName + "&";
                    break;
                }
            }
        }
        if (item == "bluetoothId") {
            for (var i = 0; i < bluetoothList.length; i++) {
                if (bluetoothList[i].id == formData[item]) {
                    var bluetoothModel = bluetoothList[i].bluetoothModel;
                    q += "bluetoothModel=" + bluetoothModel + "&";
                    break;
                }
            }
        }
        if (item == "remoteControlId") {
            for (var i = 0; i < remoteControlList.length; i++) {
                if (remoteControlList[i].id == formData[item]) {
                    var remoteControlModel = remoteControlList[i].remoteControlModel;
                    q += "remoteControlModel=" + remoteControlModel + "&";
                    break;
                }
            }
        }
        if (item == "tvIntegratedMachineValue") {
            var tvIntegratedMachineList = _this.dictMap.tv_integrated_machine;
            for (var i = 0; i < tvIntegratedMachineList.length; i++) {
                if (tvIntegratedMachineList[i].value == formData[item]) {
                    var tvIntegratedMachineLabel = tvIntegratedMachineList[i].label;
                    q += "tvIntegratedMachineLabel=" + tvIntegratedMachineLabel + "&";
                    break;
                }
            }
        }
        if (item == "tvPeripheraInputCheckboxValues") {
            var tvPeripheraInputCheckboxList = dictMap.tv_periphera_input_checkbox;
            var tvPeripheraInputCheckboxLabels = [];
            for (var i = 0; i < tvPeripheraInputCheckboxList.length; i++) {
                if (formData[item].indexOf(tvPeripheraInputCheckboxList[i].value) != -1) {
                    tvPeripheraInputCheckboxLabels.push(tvPeripheraInputCheckboxList[i].label);
                }
            }
            q += "tvPeripheraInputCheckboxLabels=" + tvPeripheraInputCheckboxLabels + "&";
        }
        if (item == "tvUiResolutionValue") {
            var tvUiResolutionList = _this.dictMap.tv_ui_resolution;
            for (var i = 0; i < tvUiResolutionList.length; i++) {
                if (tvUiResolutionList[i].value == formData[item]) {
                    var tvUiResolutionLabel = tvUiResolutionList[i].label;
                    q += "tvUiResolutionLabel=" + tvUiResolutionLabel + "&";
                    break;
                }
            }
        }
        if (item == "tvHomePageValue") {
            var tvHomePageList = _this.dictMap.tv_home_page;
            for (var i = 0; i < tvHomePageList.length; i++) {
                if (tvHomePageList[i].value == formData[item]) {
                    var tvHomePageLabel = tvHomePageList[i].label;
                    q += "tvHomePageLabel=" + tvHomePageLabel + "&";
                    break;
                }
            }
        }
        if (item == "contentSourceId") {
            for (var i = 0; i < contentSourceList.length; i++) {
                if (contentSourceList[i].id == formData[item]) {
                    var contentSourcesName = contentSourceList[i].sName;
                    q += "contentSourcesName=" + contentSourcesName + "&";
                    break;
                }
            }
        }
        if (item == "tvContentSourceSupportValues") {
            var tvContentSourceSupportList = _this.tvContentSourceSupportList;
            var tvContentSourceSupportLabels = [];
            for (var i = 0; i < tvContentSourceSupportList.length; i++) {
                if (formData[item].indexOf(tvContentSourceSupportList[i].value) != -1) {
                    tvContentSourceSupportLabels.push(tvContentSourceSupportList[i].label);
                }
            }
            q += "tvContentSourceSupportLabels=" + tvContentSourceSupportLabels + "&";
        }
        if (item == "tvGeneralSoftwareConfigValues") {
            var tvGeneralSoftwareConfigList = dictMap.tv_general_software_config;
            var tvGeneralSoftwareConfigLabels = [];
            for (var i = 0; i < tvGeneralSoftwareConfigList.length; i++) {
                if (formData[item].indexOf(tvGeneralSoftwareConfigList[i].value) != -1) {
                    tvGeneralSoftwareConfigLabels.push(tvGeneralSoftwareConfigList[i].label);
                }
            }
            q += "tvGeneralSoftwareConfigLabels=" + tvGeneralSoftwareConfigLabels + "&";
        }
        if (item == "tvAdvanceSoftwareConfigValues") {
            var tvAdvanceSoftwareConfigList = dictMap.tv_advance_software_config;
            var tvAdvanceSoftwareConfigLabels = [];
            for (var i = 0; i < tvAdvanceSoftwareConfigList.length; i++) {
                if (formData[item].indexOf(tvAdvanceSoftwareConfigList[i].value) != -1) {
                    tvAdvanceSoftwareConfigLabels.push(tvAdvanceSoftwareConfigList[i].label);
                }
            }
            q += "tvAdvanceSoftwareConfigLabels=" + tvAdvanceSoftwareConfigLabels + "&";
        }
        if (item == "tvImageQualityValues") {
            var tvImageQualityList = dictMap.tv_image_quality;
            var tvImageQualityLabels = [];
            for (var i = 0; i < tvImageQualityList.length; i++) {
                if (formData[item].indexOf(tvImageQualityList[i].value) != -1) {
                    tvImageQualityLabels.push(tvImageQualityList[i].label);
                }
            }
            q += "tvImageQualityLabels=" + tvImageQualityLabels + "&";
        }
        if (item == "tvSoundQualityValues") {
            var tvSoundQualityList = dictMap.tv_sound_quality;
            var tvSoundQualityLabels = [];
            for (var i = 0; i < tvSoundQualityList.length; i++) {
                if (formData[item].indexOf(tvSoundQualityList[i].value) != -1) {
                    tvSoundQualityLabels.push(tvSoundQualityList[i].label);
                }
            }
            q += "tvSoundQualityLabels=" + tvSoundQualityLabels + "&";
        }
        if (item == "tvCertificationValues") {
            var tvCertificationList = dictMap.tv_certification;
            var tvCertificationLabels = [];
            for (var i = 0; i < tvCertificationList.length; i++) {
                if (formData[item].indexOf(tvCertificationList[i].value) != -1) {
                    tvCertificationLabels.push(tvCertificationList[i].label);
                }
            }
            q += "tvCertificationLabels=" + tvCertificationLabels + "&";
        }
    }
    q = q.substring(0, q.length - 1);
    return q;
}
function add(_this, formParams) {
    $.post("add", formParams, function (a, b) {
        if (a == true) {
            _this.$notify({
                title: '成功',
                message: '恭喜您, 保存草稿成功',
                type: 'success'
            });
            window.location.href = "index";
        } else {
            // TODO: 如果没有权限要加以判断
            _this.$alert(a.msg, '提示', {
                confirmButtonText: '确定',
            });
            return false;
        }
    }).fail(function (jhr) {
        console.log(jhr);
        _this.$alert('保存失败', '提示', {
            confirmButtonText: '确定',
        });
    });
}
function pendingAudit(_this, formParams) {
    $.post("pendingAudit", formParams, function (a, b) {
        if (a == true) {
            _this.$notify({
                title: '成功',
                message: '恭喜您, 提交审核成功',
                type: 'success'
            });
            window.location.href = "index";
        } else {
            _this.$alert(a.msg, '提示', {
                confirmButtonText: '确定',
            });
            return false;
        }
    }).fail(function (jhr) {
        console.log(jhr);
        _this.$alert('提交审核失败', '提示', {
            confirmButtonText: '确定',
        });
    });
}
function batchdel(_this, ids) { // {ids: ids} 数组这样传,后端是接收不到的
    $.post("batchDel", "ids=" + ids, function (a, b) {
        if (a == true) {
            _this.$notify({
                title: '成功',
                message: '恭喜您, 已批量删除成功',
                type: 'success'
            });
            _this.loadData(_this.criteria, _this.currentPage, _this.pageSize);
        } else {
            _this.$alert(a.msg, '提示', {
                confirmButtonText: '确定',
            });
            return false;
        }
    }).fail(function (jhr) {
        console.log(jhr);
        _this.$alert('删除失败', '提示', {
            confirmButtonText: '确定',
        });
    });
}