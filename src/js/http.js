const _domain = 'http://apaas.example.com'
const request = {
    AppService: {
        appList(obj) {
            return obj({
                url: _domain + '/api/app/list',
                method: 'GET',
            });
        },
    },
    AllService: {
        getStaff: function (obj, data) {
            return obj({
                url: _domain + '/api/staff/describe',
                params: data,
                method: 'POST'
            });
        },
        getOrg(obj, data) {
            return obj({
                url: _domain + '/api/org/describe',
                params: data,
                method: 'POST'
            });
        }
    }
}
