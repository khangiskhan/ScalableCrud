# ScalableCrud
Scalable CRUD demo with Dojo's JsonRest data-store and Grails REST controller

# REST API
  get:
    GET http://localhost:8080/scalableCrud/accounts/{account id}
    
  add:
    POST http://localhost:8080/scalableCrud/accounts/
    
  delete:
    DELETE http://localhost:8080/scalableCrud/accounts/{account id}
    
  update:
    PUT http://localhost:8080/scalableCrud/accounts/{account id}
    
  search: 
    GET http://localhost:8080/scalableCrud/accounts/?q={string}
    
  paging:
    Paging on the REST controller is setup to accept/respond to what Dojo's JsonRest data-store expects (see http://dojotoolkit.org/reference-guide/1.8/dojo/store/JsonRest.html#paging)
    
# Dependencies
Grails 2.3.3

Dojo 1.8

Dgrid 0.3 

# Resources
http://dojotoolkit.org/reference-guide/1.8/dojo/store/JsonRest.html

http://grails.github.io/grails-doc/2.3.3/guide/webServices.html#REST

https://github.com/SitePen/dgrid/blob/v0.4.0/doc/components/core-components/OnDemandList-and-OnDemandGrid.md
