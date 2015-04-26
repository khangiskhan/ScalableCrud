/**
 * Created by Khang on 3/21/2015.
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/dom",
    "dojo/ready",
    "dojo/dom-class",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojox/mvc/_InlineTemplateMixin",
    "dojo/query",
    "dojo/when",
    "dojo/date",
    "dojox/html/entities",
    "dojo/store/Memory",
    "dojo/date/locale",
    "dijit/registry",
    "dgrid/OnDemandGrid",
    "dgrid/Keyboard",
    "dgrid/Selection",
    "dgrid/extensions/ColumnResizer",
    "dijit/form/Button",
    "dijit/form/Form",
    "dijit/Dialog",
    "dojox/mobile/SimpleDialog",
    "dijit/form/ValidationTextBox",
    "dijit/form/TextBox",
    "epic/FormattedDateTextBox"
], function(declare,
            lang,
            on,
            dom,
            ready,
            domClass,
            _WidgetBase,
            _TemplatedMixin,
            _WidgetsInTemplateMixin,
            _InlineTemplateMixin,
            query,
            when,
            date,
            entities,
            Memory,
            locale,
            registry,
            OnDemandGrid,
            Keyboard,
            Selection,
            ColumnResizer,
            Button,
            Form,
            Dialog,
            ValidationTextBox,
            TextBox ){
    /**
     *  Accounts Browser:
     *      -instantiate the template
     *      -interact with the controller to persist and sync model changes
     *      -provide event handlers
     *      @class AccountsBrowser
     */
    var AccountsBrowser = declare([_WidgetBase, _TemplatedMixin, _InlineTemplateMixin, _WidgetsInTemplateMixin], {

        // the dojo data store (JsonRest)
        store: null,
        // our DGrid
        grid: null,

        // the message output by this widget on load success/fail of data
        message: null,

        addAccount: function(Account /*Object*/){
            if (Account){
                var self = this;
                this.store.put(Account).then(
                    function(status){
                        self.grid.set("query", {});
                        self.processMessage("Successfully added account", false);
                    }, function(err){
                        if(err){
                            self.processMessage(self.processErrorResponse(err), true);
                    };
                    }, function(update){
                    });
            }
        },
        updateAccount: function(id, Account) {
            if (Account && id){
                var self = this;
                this.store.put(Account, {id: id, overwrite: true}).then(
                    function(status){
                        self.processMessage("Successfully updated account with id: "+id, false);
                    }, function(err){
                        self.processMessage(self.processErrorResponse(err), true);
                    }, function(update){
                    });
            }
        },
        removeAccount: function(id){
            if (id) {
                // change the Content-type for this call, since the store will pass an incorrect
                // header by default
                var self = this;
                this.store.remove(id, {headers: {"Content-Type": "text/html"}}).then(
                    function(status){
                        self.processMessage("Successfully removed account with id: "+id, false);
                    }, function(err){
                        self.processMessage(self.processErrorResponse(err), true);
                    }, function(update){
                    });
            }
        },

        refreshAccounts: function(){
            this.grid.set("query",{});
        },

        queryAccounts: function(parameter, value){
            var query = {};
            var valueEncoded = entities.encode(value);
            query[parameter] = valueEncoded;
            this.grid.set("query", query);
        },

        initAccountsGrid: function(store /*Dojo object store*/, attachPoint /*String, html ID*/){
            var accountGrid = new declare([OnDemandGrid,Selection,Keyboard,ColumnResizer])({
                store: store,
                //query: {},
                columns: [
                    {field: "id", label: ""},
                    {field: "first", label: "First Name"},
                    {field: "last", label: "Last Name"},
                    {field: "email", label: "Email"},
                    {field: "dob", label: "Date of Birth",
                        formatter: function(value){
                            return locale.format(new Date(value), {datePattern:"MM/dd/yyyy", selector: "date"});
                        }
                    }
                ],
                sort: "id",
                minRowsPerPage: 100,
                maxRowsPerPage: 100,
                bufferRows: 15,
                loadingMessage: "Loading..",
                cellNavigation: false,
                selectionMode: "single",
                noDataMessage: "No results found"
            }, attachPoint);

            return accountGrid;
        },

        // TODO, should bind the message node to this.message
        // instead of handling this manually
        processMessage: function(message, fail) {
            this.message = message;
            var node = this.messageNode;
            if (fail === true) {
                domClass.remove(node, "messageSuccess");
                domClass.add(node, "messageFail");
            } else {
                domClass.remove(node, "messageFail");
                domClass.add(node, "messageSuccess");
            }
            node.innerText = message;
            setTimeout(function(){
                node.innerText = "";
            }, 7000)
        },
        processErrorResponse: function(obj) {
            if (!obj) {
                return "";
            }
            var message = "";
            var jsonObj = JSON.parse(obj.response.text);
            if (jsonObj) {
                for (var i = 0; i < jsonObj.errors.length; i++){
                    if(jsonObj.errors[i])
                        message += jsonObj.errors[i].message+" ";
                }
            }
            return message;
        },

        // @Override:_WidgetBase
        postCreate: function(){
            var store = this.get("store");
            //var store = this.get("storeMemory");
            if (store) {
                this.grid = this.initAccountsGrid(store, "accountGrid");
            } else {
                throw new Error("store not found");
            }
            this.grid.startup();
        },

        // @Override:_WidgetBase
        startup: function(){
            lang.hitch(this, attachEventHandlers)();
        }
    });

    /*
     * Event Handlers
     */
    var searchHandler = function(evt){
        evt.preventDefault();
        var searchString = this.accountSearch.get("value");
        this.queryAccounts("q", searchString);
    };
    var action = null;
    var dialogSubmitHandler = function(evt){
        evt.preventDefault();
        var form = this.updateOrAddFormNode;
        if(!form.isValid()) return;

        var accountObject = getAccountObject(form);
        if (action === "add") {
            this.addAccount(accountObject);
        } else {
            var selectedAccountId = getGridIdSelections(this.grid);
            selectedAccountId = (selectedAccountId && selectedAccountId.length > 0) ? selectedAccountId[0] : null;
            this.updateAccount(selectedAccountId, accountObject);
        }
        this.updateOrAddFormDialogNode.hide();
    };

    var onShowAccountDialogClick = function(type /*String*/, evt){
        evt.preventDefault();

        // updates the action so that submit will know which handler to call
        action = type;

        // do some preprocessing
        if (type === "add") {
            // adding new account
            lang.hitch(this, preAddInit)();
        } else {
            // update existing account
            if (lang.hitch(this, preUpdateInit)() === false) {
                return; // something went wrong
            }
        }
        //dialogSubmitHandler = lang.partial(dialogSubmitHandler, this.addAccount);
       this.updateOrAddFormDialogNode.show();
    };
    var onRemoveAccountClick = function(evt){
        evt.preventDefault();
        var test = getGridIdSelections(this.grid);
        if (test && test.length > 0)
            this.confirmationDialog.show();
    };
    var removeAccountHandler = function(evt){
        evt.preventDefault();
        var selectedAccountId = getGridIdSelections(this.grid);
        if (selectedAccountId) {
            this.removeAccount(selectedAccountId[0]);
        }
        this.confirmationDialog.hide();
    };

    /*
     *  Utilities
     */
    // prepares the dialog for updating
    // returns false if no selection found
    var preUpdateInit = function() {
        // pre-fill the dialog form
        var selectedAccountId = getGridIdSelections(this.grid);
        selectedAccountId = (selectedAccountId && selectedAccountId.length > 0) ? selectedAccountId[0] : null;
            if (!selectedAccountId){
            console.warn("no account selected");
            return false; // something went wrong;
        }
        var selectedAccountObject = this.grid.row(selectedAccountId).data;
        updateDialogValues.call(this, selectedAccountObject);

        return selectedAccountId;
    };
    // prepares the dialog for adding
    var preAddInit = function() {
        updateDialogValues.call(this); // clear the dialog values
    };
    var updateDialogValues = function(AccountObject) {
        var first = null;
        var last = null;
        var email = null;
        var dob = null;
        if (AccountObject) {
            first = AccountObject.first; last = AccountObject.last; email = AccountObject.email; dob = AccountObject.dob;
        }
        this.firstNameFormNode.set("value", first);
        this.lastNameFormNode.set("value", last);
        this.emailFormNode.set("value", email);
        this.dobFormNode.set("value", dob);
    };

    var getGridIdSelections = function(grid){
        var selection = grid.get("selection");
        var selectedIds = [];
        for (var key in selection){
            if (selection[key] === true) {
                selectedIds.push(key);
            }
        };
        return selectedIds;
    };

    var getAccountObject = function(form){
        if (!form) {
            form = this.updateOrAddFormNode;
        }
        var accountObject = form.get("value");
        accountObject.first = entities.encode(accountObject.first);
        accountObject.last = entities.encode(accountObject.last);
        accountObject.email = entities.encode(accountObject.email);
        // date format required from server
        if (accountObject.dob) {
            accountObject.dob = locale.format(accountObject.dob, {datePattern: "MM/dd/yyyy", selector: "date"});
        }
        return accountObject;
    };

    // attaches event handlers to components
    var attachEventHandlers = function() {
        query("#accountSearchForm").on("submit", lang.hitch(this, searchHandler));
        this.addAccountNode.on("click", lang.hitch(this, onShowAccountDialogClick, "add"));
        this.updateAccountNode.on("click", lang.hitch(this, onShowAccountDialogClick, "update"));
        this.removeAccountNode.on("click", lang.hitch(this, onRemoveAccountClick));
        this.updateOrAddFormNode.on("submit", lang.hitch(this, dialogSubmitHandler));
        this.confirmationForm.on("submit", lang.hitch(this, lang.hitch(this, removeAccountHandler)))
        this.refreshButton.on("click", lang.hitch(this, this.refreshAccounts));
        this.grid.on(".dgrid-row:dblclick", lang.hitch(this, onShowAccountDialogClick, "update"));
    };

    return AccountsBrowser;
});