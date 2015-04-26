package epicaccounts

import grails.rest.*
import org.grails.databinding.BindingFormat

@Resource(uri='/accounts', readOnly=false, superClass=SubclassRestfulController, formats=['json', 'xml'])
class Account {

    String first
    String last
    String email
    Date   dob

    static constraints = {
        first blank:false
        last blank:false
        dob blank:true
        email email: true, blank:false, unique: true
    }
}
