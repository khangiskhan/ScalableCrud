package epicaccounts

import grails.rest.*

class SubclassRestfulController<T> extends RestfulController<T>{
    SubclassRestfulController(Class<T> domainClass) {
        this(domainClass, false)
    }

    SubclassRestfulController(Class<T> domainClass, boolean readOnly) {
        super(domainClass, readOnly)
    }

    @Override
    def index(Integer max) {
        params.max = Math.min(max ?: 100, 200)

        // Get the range request Header for paging
        String range = request.getHeader("Range");
        int start
        int end
        if (range) {
            // get the values using regex
            def matcher = (range =~ /items=(\d+)\-(\d+)/)
            if (matcher.matches()) { // matches parentString, start, end
                start = matcher[0][1].toInteger();
                end = matcher[0][2].toInteger();
                params.max = (end-start)+1;
                params.offset = start;

                int total = Account.count();
                header "Content-Range", "items $start-$end/$total"
            }
        }

        // get the sort parameters, if any
        if (params.sortBy) {
            String sign = params.sortBy.charAt(0)
            String order = null
            if (sign == " "){    // + getting encoded as " "
                order = "asc"
            } else if (sign == "-"){
                order = "desc"
            }
            params.sortBy = params.sortBy.substring(1,params.sortBy.size());
            params.order = order;
        }

        if (params.q && params.order && params.sortBy) {
            def c = Account.createCriteria()
            def results = c.list(params) {
                or {
                    ilike("first", params.q+"%")
                    ilike("last", params.q+"%")
                    ilike("email", "%"+params.q+"%")
                }
                maxResults(params.max)
                order(params.sortBy, params.order)
            }

            header "Content-Range", "items $start-$end/$results.totalCount"
            respond results, model:[accountCount: results.totalCount]
        }
        else if (params.q) {
            def c = Account.createCriteria()
            def results = c.list(params) {
                or {
                    ilike("first", params.q+"%")
                    ilike("last", params.q+"%")
                }
                maxResults(params.max)
            }

            respond results, model:[accountCount: results.totalCount]
        }
        else if(params.sortBy && params.order) {
            def c = Account.createCriteria()
            def results = c.list(params) {
                maxResults(params.max)
                order(params.sortBy, params.order)
            }
            respond results, model:[accountCount: results.totalCount]
        }
        else {
            respond listAllResources(params), model: [("${resourceName}Count".toString()): countResources()]
        }
    }
}
