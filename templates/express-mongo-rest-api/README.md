***Dependencies Used***
- [express](https://npmjs.com/package/express) *(server)*
- [body-parser](https://npmjs.com/package/) *(express middleware)* --> parses request and return body if request is a POST request
- [mongoose](https://npmjs.com/package/mongoose) *(ORM)* --> interacts with MongoDB (e.g. schema creation, CRUD operations)
- [mongo-sanitize](https://npmjs.com/package/mongo-sanitize) --> sanitizes inputs and protect against NoSQL injection
- [hot-shots](https://npmjs.com/package/hot-shots) *(analytics)* --> sends analytics data (e.g. API response time) to service like Datadog
- [winston](https://npmjs.com/package/winston) *(logging)* --> logger for API events
- [winston-datadog](https://npmjs.com/package/winston-datadog) *(logging/analytics)* --> sends winston-logged events to Datadog

***File Structure***

**controllers/** -- folder used for the controllers of the routes
    *example.controller.js* -- the controller for the route '/example'

**models/**
    *example.models.js* -- the database models used for the route '/example'

**routes/** -- folder used to define what happens at certain routes
    *example.route.js* -- file used to define what happens at route '/example'

**test/** -- folder used to store test files for all tests
    **\[any folder (e.g. 'controllers')\]**
        *\[files in folder, suffixed with '.test.js' (e.g. 'example.controller.text.js')\]*

*server.js* -- main file, used to start up server and bind to port
*package.json* -- contains all dependencies and general project info