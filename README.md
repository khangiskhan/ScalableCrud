# ScalableCrud
Scalable CRUD demo with Dojo's JsonRest data-store and Grails REST controller.  Handle CRUD operations on thousands/millions of accounts using lazy-loading (infinite scroll-ish, we have finite data here).  

Demo app deployed on AWS: http://www.khangnguyen.elasticbeanstalk.com/

# Use case and real world
Note, the amount (only 500 rows of data in this demo) and size of data here probably wouldn't need to be paged or lazy loaded, in fact performance is decreased since it makes unncessary calls to the database (the bottleneck).  

However, consider a scenario such as Facebook's friend's list viewer; it loads pictures as well as additional information, and provides actions to unfriend (delete), etc.  So basically, it's a CRUD application, similar to our basic example.  For someone with 1000 friends (I'm not that popular), you wouldn't want to to request and build all of that data at once, rather, as the user scrolls through the list, you will request a subset of data (friends).  

TODO Angular port (ngGrid, ngResource, etc)

TODO Server side caching to minimize calls to DB

TODO Tutorial on integrating Dojo's JsonRest data-store with the Grails REST controller

# Features
-Basic CRUD through REST endpoints [add, edit, delete, search].

-Lazy loading/paging/infinite scroll of data, load additional data as user scrolls.  For demo purposes, the chunks of data requested are small in order to demonstrate the lazy loading more easily, however, in a real world scenario, we can optimize the chunks so that we would reduce the number of requests we have to make to the server and database.

-Responsiveness

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
