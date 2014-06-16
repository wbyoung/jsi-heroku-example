# Heroku Example

> This repository is for learning purposes. It may intentionally contain bugs or
fail to function properly. The code may be purposefully difficult to read,
contain syntax errors, or only be a partial solution. You should not base code
off of this and absolutely should not use it in production.

This repository shows a basic Express app using Postgres that can be deployed
to Heroku:

```
git clone git@github.com:wbyoung/jsi-heroku-example.git

cd jsi-heroku-example
heroku create
heroku addons:add heroku-postgresql:dev
git push heroku master
heroku open
```

In the configuration, the environment variables that are picked up by Heroku
include:

 - `PORT`
 - `DATABASE_URL`


## License

This project is distributed under the MIT license.
