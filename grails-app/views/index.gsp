<!DOCTYPE html>
<html>
<head>
    <title>Dojo + Rest + Grails</title>
    <link rel="stylesheet" href="js/lib/dijit/themes/tundra/tundra.css" media="screen">
    <link rel="stylesheet" href="css/epic.css" media="screen">
    <script type="text/javascript">
        dojoConfig = {
            async: true,
            parseOnLoad: false,
            baseUrl:"./js",
            packages: [{
                name: "epic",
                location: "./epic"
            },{
                name: "dgrid",
                location: "./lib/dgrid"
            },{
                name: "xstyle",
                location: "./lib/xstyle"
            },{
                name: "put-selector",
                location: "./lib/put-selector"
            }/*,{
                name: "dojo",
                location: "./lib/dojo"
            },{
                name: "dojox",
                location: "./lib/dojox"
            },{
                name: "dijit",
                location: "./lib/dijit"
            }*/]
        };
    </script>
    <script src="http://ajax.googleapis.com/ajax/libs/dojo/1.8.1/dojo/dojo.js" type="text/javascript"></script>
    %{--<script src="./js/lib/dojo/dojo.js" type="text/javascript"></script>--}%
</head>
<body class="tundra">

<script type="dojo/require">
    accountsController: "epic/controller",
    at: "dojox/mvc/at"
</script>

<header class="banner" role="banner">
    <h1>Dojo + Rest + Grails</h1>
    %{--<strong class="logo"></strong>--}%
    %{--<img src="/epicAccounts/images/logo_epic.png" alt="Epic Games">--}%
</header>
<div class="mainContainer">
    <section class="accountsBrowserContainer" id="accountsBrowser" data-dojo-id="accountsBrowser" data-dojo-type="epic/AccountsBrowser" data-dojo-props="store: accountsController.getRestStoreInstance()">
        <script type="dojox/mvc/InlineTemplate">
            <section>
                    <form id="accountSearchForm" class="accountSearchForm">
                        <input data-dojo-attach-point="accountSearch" class="accountSearch" placeHolder="Filter by first/last/email" data-dojo-type="dijit/form/TextBox"/>
                        <section class="searchButtons">
                            <button type="submit" data-dojo-type="dijit/form/Button">Go</button>
                            <button data-dojo-type="dijit/form/Button" data-dojo-attach-point="refreshButton" class="refreshButton">Refresh</button>
                        </section>
                    </form>
                <section id="accountGrid" class="accountsGrid">
                </section>
                <nav class="controls">
                    <button data-dojo-type="dijit/form/Button" data-dojo-attach-point="addAccountNode" >Add</button>
                    <button data-dojo-type="dijit/form/Button" data-dojo-attach-point="removeAccountNode">Remove</button>
                    <button data-dojo-type="dijit/form/Button" data-dojo-attach-point="updateAccountNode">Update</button>
                </nav>

                <section data-dojo-attach-point="messageNode" class="messageNode">
                    %{--<input class="messageNodeTextBox" data-dojo-type="dijit/form/TextBox" data-dojo-props="value: at(accountsBrowser, 'message')"/>--}%
                </section>

                <div data-dojo-type="dijit/Dialog" data-dojo-id="myDialog" data-dojo-attach-point="updateOrAddFormDialogNode" title="Account Details" style="display: none">
                    <form data-dojo-type="dijit/form/Form" data-dojo-attach-point="updateOrAddFormNode">
                        <section class="dijitDialogPaneContentArea">
                            <section>
                                <label for="firstName">First Name:</label>
                                <input type="text" data-dojo-type="dijit/form/TextBox" name="first" data-dojo-attach-point="firstNameFormNode" required="true"
                                       data-dojo-props="trim:true, propercase:true"/>
                            </section>
                            <section>
                                <label for="lastName">Last Name:</label>
                                <input type="text" data-dojo-type="dijit/form/TextBox" name="last" data-dojo-attach-point="lastNameFormNode" required="true"
                                       data-dojo-props="trim:true, propercase:true"/>
                            </section>
                            <section>
                                <label for="lastName">Email:</label>
                                <input type="text" data-dojo-type="dijit/form/TextBox" name="email" data-dojo-attach-point="emailFormNode" required="true"
                                       placeHolder="Must be unique" data-dojo-props="trim:true, propercase:false"/>
                            </section>
                            <section>
                                <label for="lastName">Birth Date:</label>
                                <input data-dojo-type="epic/FormattedDateTextBox" name="dob" data-dojo-attach-point="dobFormNode" required="true"
                                       placeHolder="MM/dd/yyyy"/>
                            </section>
                        </section>
                        <div class="dijitDialogPaneActionBar">
                            <button data-dojo-type="dijit/form/Button" type="submit" id="formSubmit">Submit</button>
                            <button data-dojo-type="dijit/form/Button" type="button" data-dojo-props="onClick:function(){myDialog.hide();}"
                                    id="cancel">Cancel</button>
                        </div>
                    </form>
                </div>
                <div data-dojo-type="dijit/Dialog" data-dojo-attach-point="confirmationDialog"
                     data-dojo-id="confirmationDialog" title="Confirm Deletion?" style="display: none">
                    <form data-dojo-type="dijit/form/Form" data-dojo-attach-point="confirmationForm">
                        <div class="dijitDialogPaneActionBar">
                            <button data-dojo-type="dijit/form/Button" type="submit" data-dojo-attach-point="confirmSubmit">Yes</button>
                            <button data-dojo-type="dijit/form/Button" type="button" data-dojo-props="onClick:function(){confirmationDialog.hide();}">Cancel</button>
                        </div>
                    </form>
                </div>
            </section>
        </script>
    </section>
</div>

<footer class="footer"><strong class="khang">Khang Nguyen - Khnguyen@ncsu.edu </strong></footer>
<script type="text/javascript">
    require([
            "dojo/dom",
            "dojo/parser",
            "dojo/ready",
            "dojo/_base/lang",
            "dijit/registry",
            "epic/controller",
            "epic/AccountsBrowser",
            "dojo/domReady!"
    ], function(dom,
                parser,
                ready,
                lang,
                registry,
                controller,
                AccountsBrowser
                ){
        "use strict";
        // parse for declarative widgets
        parser.parse();
    });
</script>
</body>
</html>