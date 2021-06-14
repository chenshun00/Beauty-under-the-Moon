const _domain = 'https://api.raycloud.com'
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
        getApiDetail(obj, data) {
            return obj({
                url: _domain + '/api/front/api/detail',
                params: data,
                method: 'GET'
            });
        }
    }
}
