"use strict"
angular.module(APPName)
    .service('AllService', ['$http', function ($http) {
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

        this.getApiDetail = function (action, projectId) {
            const data = {action: action, projectId: projectId, type: 0};
            return request.AllService.getApiDetail($http, data)
        }

    }])

    .controller('detailController', ['AllService', '$http', '$scope', '$stateParams', 'Popup', function (AllService, $http, $scope, $stateParams, Popup) {
        const action = $stateParams.action;//传递近来的ID参数
        const title = $stateParams.title;//传递近来的ID参数
        const projectId = $stateParams.projectId;//传递近来的ID参数

        $scope.postman = {
            method: 'GET',
            tag: 1
        }

        $scope.jsonData = null;

        $scope.applicationJson = null;

        $scope.content = {
            fc: {activeTab: 1},
            fcc: {activeTab: 1},
            staffList: [],
            org: [],
            classFie: [],
            action: action,
            documentUrl: 'http://api-inner.raycloud.com/#/?menuIdx=' + projectId + '&action=' + action,
            title: title
        }

        $scope.properties = [];

        init();

        $scope.remove = function (scope) {
            scope.remove();
        };

        $scope.toggle = function (scope) {
            scope.toggle();
        };

        $scope.moveLastToTheBeginning = function () {
            const a = $scope.data.pop();
            $scope.data.splice(0, 0, a);
        };

        $scope.newSubItem = function (scope) {
            const nodeData = scope.$modelValue;
            nodeData.nodes.push({
                id: nodeData.id * 10 + nodeData.nodes.length,
                title: nodeData.title + '.' + (nodeData.nodes.length + 1),
                nodes: []
            });
        };

        $scope.collapseAll = function () {
            $scope.$broadcast('angular-ui-tree:collapse-all');
        };

        $scope.expandAll = function () {
            $scope.$broadcast('angular-ui-tree:expand-all');
        };

        //再来一次反解析，将数据渲染到前台去
        $scope.changeValue = function (current) {
            console.log(current)
            if (!$scope.data) {
                return
            }
            console.log(data)
        }

        function init() {
            AllService.getApiDetail(action, projectId).success(function (data) {
                if (data.code === 0) {
                    let domain = data.domain || _domain
                    if (domain.indexOf('http') === -1) {
                        domain = 'http://' + domain
                    }
                    $scope.postman.method = data.method;
                    $scope.postman.url = domain + data.url;
                    $scope.postman.contentType = data.contentType;
                    $scope.postman.json = $scope.postman.contentType.indexOf('application/json') !== -1;
                    $scope.postman.requestJsonObject = data.requestJsonObject;
                    //
                    if ($scope.postman.json) {
                        $scope.postman.tag = 2;
                        $scope.data = data.data;
                    } else {
                        $scope.postman.tag = 1;
                        const req = data.req;
                        if (req.modelVars) {
                            req.modelVars.forEach(function (item) {
                                const params = {};
                                params.field = item.name;
                                params.value = item.mockData;
                                params.type = item.type;
                                params.required = item.required;
                                params.desc = item.desc;
                                $scope.properties.push(params)
                            })
                        }
                    }
                    if ($scope.postman.contentType === 'form-data') {
                        $scope.postman.contentType = 'application/x-www-form-urlencoded;charset=UTF-8'
                    }
                    if ($scope.postman.method === 'GET') {
                        $scope.postman.contentType = null
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

        /**
         * 发起http请求，这里还需要详细组织一下
         * https://docs.angularjs.org/api/ng/service/$http#$http-arguments angularjs文档地址，
         * data(POST):不支持GET请求
         *  如果是application/json,那么就是requestBody的内容
         *  如果是form表单，那么就是form表达的内容
         * params(POST|GET)
         *  不论是什么，这里都是作为queryString填充在URL上
         */
        $scope.send = function () {
            //参数收集
            const data = {action: $scope.content.action}
            $scope.properties.forEach(function (item) {
                data[item.field] = item.value
            })
            $scope.jsonData = null;
            const headers = {'Content-Type': $scope.postman.contentType}
            const httpContext = {
                url: $scope.postman.url,
                method: $scope.postman.method,
                headers: headers
            }
            //    data: $scope.postman.applicationJson,
            //                 params: data,
            if ($scope.postman.method === 'GET') {
                httpContext.params = data
            }
            if ($scope.postman.method === 'POST') {
                if ($scope.postman.contentType.indexOf('json') !== -1) {
                    httpContext.data = $scope.postman.applicationJson
                } else {
                    //https://blog.csdn.net/weixin_34212762/article/details/92068021
                    httpContext.data = data
                    httpContext.transformRequest = function (obj) {
                        const str = [];
                        for (const p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    }
                }
            }


            $http(httpContext).success(function (data) {
                try {
                    $scope.jsonData = JSON.stringify(data, undefined, 4)
                } catch (e) {
                    $scope.jsonData = data
                }
            }).error(function (data) {
                try {
                    $scope.jsonData = JSON.stringify(data, undefined, 4)
                } catch (e) {
                    $scope.jsonData = data
                }
            });
        }

        /**
         * @see clear()
         */
        $scope.reset = function () {
            $scope.clear();
        }
    }]);
