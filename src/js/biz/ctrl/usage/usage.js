"use strict"
angular.module(APPName)
    .service('AllService', ['$http', function ($http) {
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

        this.getApiDetail = function (action, projectId) {
            const data = {action: action, projectId: projectId, type: 0};
            return request.AllService.getApiDetail($http, data)
        }

    }])

    .controller('detailController', ['AllService', '$scope', '$stateParams', 'Popup', function (AllService, $scope, $stateParams, Popup) {
        const action = $stateParams.action;//传递近来的ID参数
        const title = $stateParams.title;//传递近来的ID参数
        const projectId = $stateParams.projectId;//传递近来的ID参数

        $scope.postman = {
            method: 'GET'
        }

        $scope.jsonData = "{'name':1}";

        $scope.content = {
            fc: {activeTab: 1},
            fcc: {activeTab: 1},
            staffList: [],
            org: [],
            classFie: [],
            action: action,
            url: 'http://api-inner.raycloud.com/#/?menuIdx=' + projectId + '&action=' + action,
            title: title
        }

        $scope.properties = [];

        init();

        function init() {
            AllService.getApiDetail(action, projectId).success(function (data) {
                if (data.code === 0) {
                    $scope.postman.method = data.method;
                    $scope.postman.url = _domain + data.url;
                    const req = data.req;
                    if (req.modelVars) {
                        req.modelVars.forEach(function (item) {
                            const params = {};
                            params.field = item.name;
                            params.type = item.type;
                            params.required = item.required;
                            params.desc = item.desc;
                            $scope.properties.push(params)
                        })
                    }

                } else {
                    Popup.notice(data.errmsg, 2000)
                }
            })
        }

        $scope.clear = function () {
            $scope.properties.forEach(function (item) {
                item.value = null
            });
        };

        const temp ={string: 'str',
                number: 12.34,
                boolean: true,
                array: [3, 1, 2],
                object: {
                    anotheObject: {
                        key1: 1,
                        bool: true
                    }
                },
                arrayOfObjects: [{
                    key1: 'Hello',
                    key2: 'World!'
                }, {
                    bool: true,
                    someFunction: function () {
                        return 'some function'
                    }
                },
                    true,
                    []
                ],
                function1: function () {
                    alert('This is function1 !');
                },
                null: null,
                undefined: undefined
            };

        $scope.send = function () {
            $scope.jsonData = JSON.stringify(temp, undefined, 4);
            console.log($scope.jsonData)
        }

        /**
         * @see clear()
         */
        $scope.reset = function () {
            $scope.clear();
        }

        $scope.choose = function ($event, staff) {
            $event.stopPropagation();//阻止冒泡
            staff.checked = !staff.checked
        };

    }]);
