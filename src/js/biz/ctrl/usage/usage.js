"use strict"
angular.module(APPName)
    .service('AllService', ['$http', function ($http) {
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

        this.getApiDetail = function (action, projectId) {
            const data = {action: action, projectId: projectId, type: 0};
            return request.AllService.getApiDetail($http, data)
        }

    }])
    .provider('$copyToClipboard', [function () {

        this.$get = ['$q', '$window', function ($q, $window) {
            var body = angular.element($window.document.body);
            var textarea = angular.element('<textarea/>');
            textarea.css({
                position: 'fixed',
                opacity: '0'
            });
            return {
                copy: function (stringToCopy) {
                    var deferred = $q.defer();
                    deferred.notify("copying the text to clipboard");
                    textarea.val(stringToCopy);
                    body.append(textarea);
                    textarea[0].select();

                    try {
                        var successful = $window.document.execCommand('copy');
                        if (!successful) throw successful;
                        deferred.resolve(successful);
                    } catch (err) {
                        deferred.reject(err);
                        //window.prompt("Copy to clipboard: Ctrl+C, Enter", toCopy);
                    } finally {
                        textarea.remove();
                    }
                    return deferred.promise;
                }
            };
        }];
    }])
    .controller('detailController', ['AllService', '$http', '$scope', '$stateParams', 'Popup', '$copyToClipboard',
        function (AllService, $http, $scope, $stateParams, Popup, $copyToClipboard) {
            const action = $stateParams.action;//传递近来的ID参数
            const title = $stateParams.title;//传递近来的ID参数
            const projectId = $stateParams.projectId;//传递近来的ID参数

            $scope.history = [];

            const request = window.indexedDB.open(_DB, 1);

            request.onerror = function (event) {
                console.log('数据库打开报错,' + event);
            };

            let db;

            request.onsuccess = function (event) {
                db = request.result;
                console.log('数据库打开成功');
                let objectStore;
                if (!db.objectStoreNames.contains(_TABLE)) {
                    objectStore = db.createObjectStore(_TABLE, {keyPath: 'id'});
                    objectStore.createIndex('action', 'action', {unique: false});
                }
            };

            request.onupgradeneeded = function (event) {
                db = event.target.result;
                let objectStore;
                if (!db.objectStoreNames.contains(_TABLE)) {
                    objectStore = db.createObjectStore(_TABLE, {keyPath: 'id'});
                    objectStore.createIndex('action', 'action', {unique: false});
                }
            }

            function add(obj) {
                const request = db.transaction([_TABLE], 'readwrite')
                    .objectStore(_TABLE)
                    .add(obj);

                request.onsuccess = function (event) {
                    console.log('数据写入成功');
                };

                request.onerror = function (event) {
                    console.log('数据写入失败:' + event);
                }
            }

            function query(id) {
                const transaction = db.transaction([_TABLE]);
                const objectStore = transaction.objectStore(_TABLE);
                const request = objectStore.get(id);
                request.onerror = function (event) {
                    Popup.notice('查询历史记录失败,打开控制台查看日志', 3000)
                    console.log(event)
                };

                request.onsuccess = function (event) {
                    if (request.result) {
                        $scope.postman = request.result.postman
                        $scope.postman.body = !$scope.postman.body
                        $scope.properties = request.result.properties
                    } else {
                        console.log('未获得数据记录');
                    }
                };
            }

            function read() {
                const transaction = db.transaction([_TABLE]);
                const objectStore = transaction.objectStore(_TABLE);
                const request = objectStore.index('action')
                    .openCursor($scope.content.action)

                request.onerror = function (event) {
                    console.log('事务失败');
                };
                const temp = []
                request.onsuccess = function (event) {
                    const cursor = event.target.result;

                    if (cursor) {
                        const tt = cursor.value;
                        //这里需要组织一下数据,然后更新一下数据材料
                        temp.push({action: tt.action, time: tt.id})
                        cursor.continue();
                    } else {
                        console.log('没有更多数据了！');
                    }
                    $scope.history = temp;
                };
            }

            $scope.invokeHistory = function () {
                $scope.postman.body = !$scope.postman.body
                if (!$scope.postman.body) {
                    read()
                }
            }

            $scope.postman = {
                method: 'GET',
                tag: 1,
                body: true,
                queryString: false,
                queryParams: [],
                jsonData: null,
                data: {},
                requestJsonObject: {},
                trequestJsonObject: ""
            }

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

            $scope.queryHistory = function (his) {
                const id = his.time;
                query(id);
            }

            //再来一次反解析，将数据渲染到前台去
            $scope.changeValue = function () {
                if (!$scope.postman.data) {
                    return
                }
                $scope.postman.requestJsonObject = parseModel($scope.postman.data)
                $scope.postman.trequestJsonObject = JSON.stringify($scope.postman.requestJsonObject, null, 0)
            }

            function parseModel(req) {
                let obj = {};
                req.forEach(function (item, index, arr) {
                    const field = item.field
                    const mock = item.mock
                    if (item.type === undefined) {
                        return
                    }
                    if (item.type === 'normal') {
                        obj[field] = mock
                    } else if (item.type === 'object') {

                    } else if (item.type === 'array') {
                        const temp = item.nodes
                        if (obj[field] === undefined) {
                            obj[field] = [];
                        }
                        obj[field].push(parseModel(temp))
                    }
                });
                return obj;
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
                        $scope.postman.httpPath = data.url;
                        $scope.postman.contentType = data.contentType;
                        $scope.postman.json = $scope.postman.contentType.indexOf('application/json') !== -1;
                        //
                        if ($scope.postman.json) {
                            $scope.postman.tag = 2;
                            $scope.postman.data = data.data;
                            $scope.postman.requestJsonObject = parseModel($scope.postman.data)
                            $scope.postman.trequestJsonObject = JSON.stringify($scope.postman.requestJsonObject, null, 0)
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
                        if ($scope.postman.contentType === 'multipart/form-data') {
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

            $scope.urlParams = function () {
                $scope.postman.queryString = !$scope.postman.queryString
                if ($scope.postman.queryParams.length === 0) {
                    $scope.postman.queryParams.push({})
                }
            }

            $scope.plus = function () {
                $scope.postman.queryParams.push({})
            }
            $scope.less = function (index) {
                $scope.postman.queryParams.splice(index, 1)
            }

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

                const query = {};
                if ($scope.postman.queryParams.length > 0) {
                    $scope.postman.queryParams.forEach(function (item) {
                        if (item.field !== undefined && item.field.length > 0 && item.value !== undefined
                            && item.value.length > 0) {
                            query[item.field] = item.value
                        }
                    });
                }

                $scope.postman.jsonData = null;
                const headers = {'Content-Type': $scope.postman.contentType}
                if ($scope.postman.httpPath === '/') {
                    $scope.postman.url = $scope.postman.url + action
                }
                const httpContext = {
                    url: $scope.postman.url,
                    method: $scope.postman.method,
                    headers: headers
                }

                //如果是get请求，设置成params.
                if ($scope.postman.method === 'GET') {
                    httpContext.params = Object.assign(data, query)
                }
                if ($scope.postman.method === 'POST') {
                    httpContext.params = query
                    if ($scope.postman.contentType.indexOf('json') !== -1) {
                        httpContext.data = $scope.postman.requestJsonObject
                        httpContext.params.action = action
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
                        $scope.postman.jsonData = JSON.stringify(data, undefined, 4)
                    } catch (e) {
                        $scope.postman.jsonData = data
                    }
                    const save = {
                        id: new Date().getTime(),
                        action: $scope.content.action,
                        properties: $scope.properties,
                        postman: $scope.postman,
                        content: $scope.content
                    }
                    add(save);
                }).error(function (data) {
                    try {
                        $scope.postman.jsonData = JSON.stringify(data, undefined, 4)
                    } catch (e) {
                        $scope.postman.jsonData = data
                    }
                    const save = {
                        id: new Date().getTime(),
                        action: $scope.content.action,
                        properties: $scope.properties,
                        postman: $scope.postman,
                        content: $scope.content
                    }
                    add(save);
                });
            }


            $scope.reset = function () {
                $scope.clear();
            }

            $scope.clear = function () {
                $scope.properties.forEach(function (item) {
                    item.value = null
                });
            };

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

            $scope.copyHrefToClipboard = function () {
                $copyToClipboard.copy($scope.content.action).then(function () {
                    //show some notification
                });
            };
        }])
