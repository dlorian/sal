import Ember from 'ember';

export default Ember.Component.extend({
    didInsertElement: function() {
        var me = this;
        this.renderMonthChart();

        Ember.$('a[aria-controls="totalOverviewTab"]').on('shown.bs.tab', function () {
            // render chart if the pill was clicked
            me.renderTotalOverviewChart();
        });
    },

    renderMonthChart: function() {
        var series = this.getMonthSeries(this.get('data'));
        Ember.$('#chart1').highcharts({
            title: {
                text: null
            },
            xAxis: {
                categories: [
                    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'Septemper', 'Oktober', 'November', 'Dezember'
                ],
                labels: {
                    formatter: function () {
                        return '<a href="' + this.value + '">'+ this.value + '</a>';
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Gesamtstrecke (km)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: 'km'
            },
            legend: {
                align: 'right',
                verticalAlign: 'top',
                layout: 'vertical',
                x: 0,
                y: 100
            },
            series: series
        });
    },

    renderTotalOverviewChart: function() {
        var series = this.getTotalOverviewSeries(this.get('data'));
        Ember.$('#chart2').highcharts({
            chart: {
                type: 'spline',
                zoomType: 'x'
            },
            title: {
                text: null
            },
            xAxis: {
                type: 'category',
                max: 366,
                min: 0,
                labels: {
                    formatter: function() {
                        return moment().dayOfYear(this.value).format("DD.MM");
                    }
                }
            },
            yAxis: {
                title: {
                    text: 'Gesamtstrecke (km)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            plotOptions: {
                series: {
                    pointStart: 0,
                    pointInterval: 30
                }
            },
            tooltip: {
                valueSuffix: 'km',
                formatter: function() {
                    var s = '<b>' + moment().dayOfYear(this.x).format("DD.MM") + '</b><br/>';
                    s += '<span style="color:'+this.point.color+'">\u25CF</span> '+this.series.name+': <b>'+this.point.y+'</b>km<br/>';
                    return s;
                },
            },
            legend: {
                align: 'right',
                verticalAlign: 'top',
                layout: 'vertical',
                x: 0,
                y: 100
            },
            series: series
        });

    },

    getMonthSeries: function(data) {
        var dataHash = this.prepareMonthDataHash(data);
        var series = [];

        var getSeriesEntry = function(name, entryData) {
            var dataArray = Ember.$.map(entryData, function(value) {
                if(value && value.toNumber) {
                    return [value.toNumber()];
                }
                return [value];
            });

            return  {
                name: name.toString(),
                data: dataArray
            };
        };

        for(var year in dataHash) {
            series.push(getSeriesEntry(year, dataHash[year]));
        }

        return series;
    },

    getTotalOverviewSeries: function(data) {
        var dataHash = this.prepareTotalOverviewDataHash(data)
        var series = [];

        for(var year in dataHash) {
            var yearSeries = [];
            for(var day in dataHash[year]) {
                yearSeries.push({x: day, y: dataHash[year][day]});
            }
            series.push({
                type: 'spline',
                name: year.toString(),
                data: yearSeries,
                connectNulls: true,
                pointStart: 0,
                pointInterval: 30
            });
        }
        return series;
    },

    prepareMonthDataHash: function(data) {
        var dataHash = { };

        var getYearObject = function() {
            var obj = {};
            for(var i = 0; i < 12; i++) {
                obj[i] = new Decimal(0);
            }
            return obj;
        };


        data.forEach(function(element) {
            var date = moment(element.get('date')).toDate();
            var year = date.getFullYear();
            var month = date.getMonth();
            if(dataHash[year] === undefined) {
                dataHash[year] = getYearObject();
            }

            var totalKm = new Decimal(parseFloat(element.get('totalKm')));
            if(!totalKm.isNaN()) {
                dataHash[year][month] = dataHash[year][month].plus(totalKm);
            }
        });
        return dataHash;
    },

    prepareTotalOverviewDataHash: function(data) {
        var dataHash = {};

        var getYearObject = function() {
            var obj = {};
            for(var i = 0; i <= 366; i++) {
                obj[i] = null;
            }

            return obj;
        }

        data.forEach(function(element) {
            var date = moment(element.get('date')).toDate();
            var year = date.getFullYear();

            if(dataHash[year] === undefined) {
                dataHash[year] = getYearObject();
            }
            var day = moment(date).dayOfYear();
            var totalKm = new Decimal(parseFloat(element.get('totalKm')));
            dataHash[year][day] = totalKm.toNumber();
        });

        return dataHash;
    }
});