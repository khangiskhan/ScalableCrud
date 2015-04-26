/**
 * Created by Khang on 3/19/2015.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/store/JsonRest",
    "dojox/data/JsonRestStore",
    "dojo/store/Observable",
    "dojo/store/Memory",
    "dojo/store/Cache",
    "dojo/data/ObjectStore",
    "dgrid/OnDemandGrid",
    "dgrid/Keyboard",
    "dgrid/Selection",
    "dojo/request"
], function(declare,
            lang,
            JsonRest,
            JsonRestStore,
            Observable,
            Memory,
            Cache,
            ObjectStore,
            OnDemandGrid,
            Keyboard,
            Selection,
            request){

    /* Private variables and methods */
    var asyncRequest = function(url, options, successHandler, errorHandler){
            request(url, options).then(successHandler, errorHandler);
    };
    var accountsUrl = "./accounts/";
    var store = null;
    /*var storeMemory = null;
    var storeMaster = null;*/

    /*
     * Our public controller object to return
     * */
    var controller = declare([], {
        initRestStore: function(){
            /*storeMaster = new JsonRest({target:accountsUrl});
            storeMemory = new Observable(new Memory());
            return storeMemory;*/
            var storeMaster = new JsonRest({target:accountsUrl, sortParam: "sortBy"});
            store = new Observable(storeMaster);
            return store;
        },

        /*initCache: function(){
            var storeMaster = new JsonRest({target:accountsUrl, sortParam: "sortBy"});
            storeMemory = new Observable(new Memory());
            store =  new Cache(storeMaster, storeMemory);
            return store;
        },*/

        /*
        returns the Observable memory store
         */
        /*getMemoryStoreInstance: function(){
            return storeMemory;
        },*/

        getRestStoreInstance: function(){
            if (!store) {
                store = this.initRestStore();
            }
            return store;
        },

        constructor: function(){
            this.initRestStore();
        }

    });
    return new controller();
});