



# browsers.service:JsorollaService











Service loading JSorolla for Track management







## Dependencies


* ONLINE
* https://code.angularjs.org/1.3.16/docs/api/ng/service/$log
* https://code.angularjs.org/1.3.16/docs/api/ng/service/$q



  




## Methods
### load
A function that loads the files required to initialize and run OpenCB Jsorolla API.
Uses $q.all to ensure all are loaded before returning.
Currently only loads the Genome Viewer component.






#### Returns</h4>

| Type | Description |
| :--: | :--: |
| Array | <p>results of appending the files. [ null &#124; undefined &#124; String &#124; Array &#124; Object &#124; don&#39;t know ].</p>  |









