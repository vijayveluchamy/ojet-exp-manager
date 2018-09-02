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
  
    function MonthlyTotalReportModel() {
      var self = this;

      /**
       * function to calculate total month-wise
       * @param expData 
       */
      self.calculateMonthlyTotal = function(expData) {
        var resultArray = [];
        var years = Object.keys(expData);

        years.forEach(function (year){
            var yearData = expData[year];
            var months = Object.keys(yearData);
            months = months.sort();

            months.forEach(function (month){
                var resultKey = self.months[month]+"-"+year;
                var monthlyExpensesArray = Object.values(yearData[month]);
                var monthlyTotal = monthlyExpensesArray.reduce(function(prev, curr) {
                    return prev + curr;
                }, 0);
                resultArray.push({
                    'name': resultKey,
                    'items': [monthlyTotal]
                });
            });
        });

        return resultArray;
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

      self.onYearChange = function (event) {
        var year = event.target.value;

        var monthlyData = self.monthlyTotalData;
        if (year) {
          monthlyData = monthlyData.filter(function (entry) {
            return entry['name'].endsWith(year);
          });
        }
        self.datasource(monthlyData);
        //ko.utils.arrayPushAll(self.datasource, monthlyData);
      };

      self.barChartDataLabel = function (context) {
        return context.value;
      }

      self.expenseData = JSON.parse(expenseDataStr);
      self.months = JSON.parse(monthStr);
      // Populate dropdown values
      self.years = self.generateYearsDropdownData(Object.keys(self.expenseData));
      self.selectedYear = ko.observable(null);
      //Calculate monthly total and assign as datasource to chart
      self.monthlyTotalData = self.calculateMonthlyTotal(self.expenseData);  
      self.datasource = ko.observableArray(self.monthlyTotalData);
      
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
    return new MonthlyTotalReportModel();
  }
);
