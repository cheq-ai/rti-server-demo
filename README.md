<h5>CHEQ's Real Time Interception Demo</h1>

The following repository demonstrate a simple demo which utilize CHEQ's RTI solution.

In order to run the demo a `config.js` file will need to be created under root directory.

```javascript
//config.js
module.exports = {
    tagHash : "bebceff7cb66cf7232478306cba94d8e",
    apiKey: "abcdddd-dddd3-492f-9417-66a1f22b4daa",
    cheqsEngineUri: "https://obs.cheqzone.com/v1/realtime-interception"
}
``` 

**tagid** - a numeric id which can be found under CHEQ's invocation code url.
**tagHash** - a string hash id which can be found under CHEQ's invocation code url (comes instead tagid).

```
https://[domain]/clicktrue_invocation.js?id=[TAG_ID]
```

**apiKey** - an API token key given by CHEQ.

**cheqsEngineUri** - CHEQ RTI backend server URI.

```
https://obs.cheqzone.com/v1/realtime-interception
```

Once config file have been setup properly, simply run the demo by
 
```
node server.js
```

And visit  `localhost:8080`

**Notes:**
* The `views/block.ejs` represent a page where an invalid request will reach.
* The `views/pass.ejs` represent a page where a valid request will reach.
