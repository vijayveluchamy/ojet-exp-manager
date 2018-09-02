/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your incidents ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'text!data/expense.json', 'text!data/month.json', 'ojs/ojchart', 'ojs/ojselectcombobox'],
 function(oj, ko, $, expenseDataStr, monthStr) {
  
    function MonthlyDetailedReportModel() {
      var self = this;

      /**
       * function to calculate total month-wise
       * @param expData 
       */
      self.prepareMonthlyDetailedDataSource = function(expData) {
        var resultObj = {};
        var years = Object.keys(expData);

        years.forEach(function (year){
            var yearData = expData[year];
            var months = Object.keys(yearData);
            months = months.sort();

            months.forEach(function (month){
                var resultKey = self.months[month]+"-"+year;
                var monthlyExp = yearData[month];
                var monthlyExpDataSource = [];

                Object.keys(monthlyExp).forEach(function(expKey){
                    monthlyExpDataSource.push({
                        'name': expKey,
                        'items': [ monthlyExp[expKey] ] 
                    })
                });

                if (!resultObj[year]){
                    resultObj[year] = {};
                }

                resultObj[year][month] = monthlyExpDataSource;
            });
        });

        return resultObj;
      };

      /**
       * Generate data for 'years' dropdown
       */

      self.generateYearsDropdownData = function (years) {
        
        var yearDropdownData = years.map(function (year){
            return {'value': year, 'label': year};
        });
        //Add empty value
        yearDropdownData.push({'value': '', 'label': ''});

        //Get years in reverse chrono order
        return yearDropdownData.reverse();
      };

      self.generateMonthsDropdownData = function (monthObj) {
          var monthDropdownData = [];
          var keys = Object.keys(monthObj);
          keys.sort();

          monthDropdownData.push({
            'value': '',
            'label': ''
          });

          keys.forEach(function (monthIdx){
            monthDropdownData.push({
                'value': monthIdx,
                'label': monthObj[monthIdx]
            });
          });
          return monthDropdownData;
      }
      /**
       * year change listener
       * @param {*} event 
       */
      self.onYearChange = function (event) {
        var value = event.target.value;
        if (!value){
            return;
        }
        
        self.selectedYear(value);
        self.setDataSource();
      };

      self.onMonthChange = function (event) {
        var value = event.target.value;
        if (!value){
            return;
        }
        
        self.selectedMonth(value);  
        self.setDataSource();
      };

      self.chartDataLabel = function (context) {
        return context.series + ' : ' + context.label + ' : ' + context.value;
      };

      self.setDataSource = function () {
        self.datasource( self.monthWiseDataSource[self.selectedYear()][self.selectedMonth()] );
      };

      self.expenseData = JSON.parse(expenseDataStr);
      self.monthsObj = JSON.parse(monthStr);
      // Populate dropdown values
      self.years = self.generateYearsDropdownData(Object.keys(self.expenseData));
      self.selectedYear = ko.observable();

      self.months = self.generateMonthsDropdownData(self.monthsObj);
      self.selectedMonth = ko.observable();
      //Calculate monthly total and assign as datasource to chart
      self.monthWiseDataSource = self.prepareMonthlyDetailedDataSource(self.expenseData);  
      self.datasource = ko.observableArray([]);

      self.connected = function() {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function() {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function() {
        // Implement if needed
      };
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new MonthlyDetailedReportModel();
  }
);
