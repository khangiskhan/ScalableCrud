import epicaccounts.Account

class BootStrap {


    def grailsApplication
    def init = { servletContext ->
        if (Account.count() == 0){
            //log.debug("ImportDetail.count is zero")
            def filePath = "resources/MOCK_DATA.csv"
            def myFile = grailsApplication.mainContext.getResource("classpath:$filePath").file
            def i = 1
            myFile.splitEachLine(',') {fields ->
                def account = new Account(
                        id      : fields[0],
                        first   : fields[1],
                        last    : fields[2],
                        email   : fields[3],
                        dob     : fields[4]
                )
                account.validate()
                if (account.hasErrors()){
                    //log.debug("could not import line ${i}")
                } else {
                    account.save(failOnError: true, flush: true)
                }
                ++i
            }
        }
    }
    def destroy = {
    }
}
