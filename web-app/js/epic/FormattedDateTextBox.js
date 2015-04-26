define(["dojo/_base/declare", "dijit/form/DateTextBox", "dojo/date/locale"],
    function(declare, DateTextBox, locale){

        return declare([DateTextBox], {
            dateFormat: {selector: 'date', datePattern: 'MM/dd/yyyy'},
            value: "",
            postMixInProperties: function(){
                this.inherited(arguments)
                this.value = locale.parse(this.value, this.dateFormat);
            },

            serialize: function(dateObject, options){
                return locale.format(dateObject, this.dateFormat).toUpperCase();
            }
        })
    }
)