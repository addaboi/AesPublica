var scanner = new Vue({
    el: '#scanner',
    delimiters: ["<%","%>"],

    data: {
        ask: {
            newName: "",
            newNameChanged: false,
            rawChanged: false,
            charId: 0,
            locationId: 0,
            assetsCharId: 0,
            assetsLocationId: 0,
        },
        scanners: [],
        selected: null,
        loading: false,
        newStationId: 0
    },

    created: function () {
        var vm = this;
        axios.get('/mscans.json')
            .then(function (response) {
                vm.scanners = response.data.list;
                vm.selected = null;
            })
            .catch(function (error) {
                console.log(error);
            });

        new Clipboard('#copy-point', {
            text: function(trigger) {
                return vm.CopyNeed();
            }
        });

        new Clipboard('.copy-item');

    },

    methods: {

        NewNameChanged: function(){
            if(!!this.ask.newName){
                this.ask.newNameChanged = true;
            }
        },

        RawChanged: function(){
            if(this.selected && !!this.selected.raw){
                Vue.set(this.selected, 'rawChanged', true);
            }
        },

        AddLocation: function(){
            var vm = this;
            axios.post(
                '/mscans/'+vm.selected.id+'/locations.json', {char_id: vm.ask.charId, location_id: vm.ask.locationId, kind: 'audit'}
            ).then(function (response) {
                vm.selected = response.data.selected;
                vm.ask.charId = 0;
                vm.ask.locationId = 0;
                $('.auditors .location-selector').val('');
            }).catch(function (error) {
                console.log(error);
            });
        },

        AddAssetsLocation: function(){
            var vm = this;
            axios.post(
                '/mscans/'+vm.selected.id+'/locations.json', {char_id: vm.ask.assetsCharId, location_id: vm.ask.assetsLocationId, kind: 'asset'}
            ).then(function (response) {
                vm.selected = response.data.selected;
                vm.ask.assetsCharId = 0;
                vm.ask.assetsLocationId = 0;
                $('.assets .location-selector').val('');
            }).catch(function (error) {
                console.log(error);
            });
        },

        DeleteLocation: function(id){
            var vm = this;
            axios.delete(
                '/mscans/'+vm.selected.id+'/locations/'+id+'.json'
            ).then(function (response) {
                vm.selected = response.data.selected;
            }).catch(function (error) {
                console.log(error);
            });
        },

        AddScanner: function(){
            var vm = this;
            axios.post('/mscans.json', {name: this.ask.newName})
                .then(function (response) {
                    vm.scanners = response.data.list;
                    vm.selected = response.data.selected;
                    vm.ask.newName = '';
                    vm.ask.newNameChanged = false;
                })
                .catch(function (error) {
                    console.log(error);
                });

        },

        StartRenameScanner: function(item){
            item.oldName = item.name;
            Vue.set(item, 'editing', true);
        },

        CancelRenameScanner: function(item){
            item.name = item.oldName;
            Vue.set(item, 'editing', false)
        },

        RenameScanner: function(item){
            var vm = this;
            axios.post('/mscans/'+item.id+'/rename.json', {name: item.name})
                .then(function (response) {
                    vm.scanners = response.data.list;
                })
                .catch(function (error) {
                    console.log(error);
                });
        },

        AskDeleteScanner: function(scannerId){
            if (confirm("Sure?")) {
                var vm = this;
                axios.post('/mscans/'+scannerId+'/delete.json')
                    .then(function (response) {
                        vm.scanners = response.data.list;
                        vm.selected = null;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        },

        UpdateRawText: function(){
            var vm = this;
            axios.post('/mscans/'+this.selected.id+'.json', {raw: this.selected.raw})
                .then(function (response) {
                    vm.selected = response.data.selected;
                })
                .catch(function (error) {
                    console.log(error);
                });
        },

        ChangeFitTimes: function(){
            var vm = this;
            axios.post('/mscans/'+this.selected.id+'.json', {fit_times: parseInt(this.selected.fit_times)})
                .then(function (response) {
                    vm.selected = response.data.selected;
                }).catch(function (error) {console.log(error);});
        },
        ChangeGoalFitTimes: function(){
            var vm = this;
            axios.post('/mscans/'+this.selected.id+'.json', {goal_fit_times: parseInt(this.selected.goal_fit_times)})
                .then(function (response) {
                    vm.selected = response.data.selected;
                }).catch(function (error) {console.log(error);});
        },
        ChangeStoreFitTimes: function(){
            var vm = this;
            axios.post('/mscans/'+this.selected.id+'.json', {store_fit_times: parseInt(this.selected.store_fit_times)})
                .then(function (response) {
                    vm.selected = response.data.selected;
                }).catch(function (error) {console.log(error);});
        },

        UpdateMarketInfo: function(){
            var vm = this;
            this.loading=true;

            axios.post(
                '/mscans/'+vm.selected.id+'/market_info.json'
            ).then(function (response) {
                vm.selected = response.data.selected;
                vm.loading=false;
            })
            .catch(function (error) {
                console.log(error);
            });
        },

        CopyNeed: function(vm){
            result = "";
            this.selected.items.forEach(function(el){
                if(el.need_qty>0){
                    result = result + el.type.name + ", " + el.need_qty + "\n";
                }
            });
            return result;
        },

        SetSelected: function(item){
            var vm = this;
            axios.get('/mscans/'+item.id+'.json')
                .then(function (response) {
                    vm.selected = response.data.selected;
                })
                .catch(function (error) {
                    console.log(error);
                });
        },

        IsSelected: function(item){
            return this.selected != null && this.selected.id == item.id;
        },

        AuditorLocationSelected: function(event){
            this.ask.locationId = event.id;
        },

        AssetsLocationSelected: function(event){
            this.ask.assetsLocationId = event.id;
        },

        IsRedItem: function(item){
            return item.fit_times < this.selected.fit_times;
        },

        IsPinkItem: function(item){
            return item.fit_times < this.selected.goal_fit_times;
        },

        IsYellowItem: function(item){
            return item.store_fit_times < this.selected.store_fit_times;
        },

        IsOverpriced: function(price, jita){
            return price > 1.5*jita;
        },

    },
})


