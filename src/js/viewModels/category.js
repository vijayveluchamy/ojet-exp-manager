/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your incidents ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'underscore', 'text!data/expense.json', 'text!data/month.json', 'ojs/ojchart', 'ojs/ojselectcombobox'],
 function(oj, ko, $, _, expenseDataStr, monthStr) {
  
    function CategoryReportModel() {
        var self = this;
        
        self.pickCategories = function (expData) {
            var categories = [];
            _.each(expData, function (yearData, year){
                _.each(yearData, function (monthData, month){
                    var curMonthCategories = _.keys(monthData);
                    categories = _.union(categories, curMonthCategories);
                });
            });
            //Sort the categories
            categories.sort();
            return categories;
        };

        self.populateCategoryDropdown = function (categories) {
            var result = [];
            result.push({'value': '', 'label': ''});

            _.each(categories, function (category){
                result.push({'value': category, 'label': category});
            });
            
            return result;
        };

        self.onCategoryChange = function (event) {
            var category = event.target.value;
            console.log('Selected Category', category);

            self.selectedCategory(category);
            var catDataSource = self.getCategoryWiseDataSource(self.expenseData, category);
            self.datasource(catDataSource);
        };

        self.getCategoryWiseDataSource = function (expData, category) {
            var result = [];

            if(!category){
                return result;
            }

            _.each(expData, function (yearData, year){
                var months = _.keys(yearData);
                months.sort();

                _.each(months, function (month){
                    var monthData = yearData[month];
                    var resultKey = self.monthsObj[month]+"-"+year;

                    var categoryExpense = monthData[category] || 0;
                    result.push({
                        'name': resultKey,
                        'items': [ categoryExpense ] 
                    });
                });
            });

            return result;
        };

        self.barChartDataLabel = function (context) {
            return context.value;
        };


        self.expenseData = JSON.parse(expenseDataStr);
        self.monthsObj = JSON.parse(monthStr);

        //Pick Categories
        var categoriesArray = self.pickCategories(self.expenseData);
        self.categories = self.populateCategoryDropdown(categoriesArray);
        self.selectedCategory = ko.observable();

        //Datasource
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
    return new CategoryReportModel();
  }
);
