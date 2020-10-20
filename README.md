# Doppler-UI-System

UI live guide style. This library is meant to be Doppler visual language, to centralize all branding in one place for all our products. Also allowing to decouple UI from Front End logic, and work in a more tidy way.

# What elements do we have right now on this library?

Please check the cdn: [http://cdn.fromdoppler.com/doppler-ui-library/latest/index.html](http://cdn.fromdoppler.com/doppler-ui-library/latest/index.html)

# How can you use this library in you own project?

Simply including the css and js file in your html. Just check the correct version under github releases tab first and replace the `x.x.x` below.

**CSS**
`<link rel="stylesheet" type="text/css" href="https://cdn.fromdoppler.com/doppler-ui-library/vx.x.x/css/styles.css">`

**JS** (optional, you can include your own js instead)
`<script type="text/javascript" src="https://cdn.fromdoppler.com/doppler-ui-library/vx.x.x/js/app.js"></script>`

# How to apply components and use mixins?

Check our [Documentation](http://cdn.fromdoppler.com/doppler-ui-library/latest/documentation/index.html)

# Contributing to this project

If you want to contribute to this project you should follow the rules:

- We use conventional commits please check usage here: [Conventional Commits](https://www.conventionalcommits.org/)

- Commits are short so they can be easy to follow and read.

- Colors, spacing and font sizes are stored in variables for reuse.

- When making a PR, please check the cdn build code automatically generated, look through the build number in jenkins pull request builder check link, it should be something like `http://docker.fromdoppler.com:8080/job/doppler-ui-system/job/pull-requests/391/` in this example 391 is you build, your link will be  `http://cdn.fromdoppler.com/doppler-ui-library/build391/index.html` you can use this link to also include and test in your webpage, pointing to css and js, as it was explained before.

- Consider getting the approval of at least one of our regular contributors.

- Take in account that this library can have a lot of clients, we think in retrocompatibility before making changes.

- Fork this project to start contributing.

# How to work with the code?

Once you downloaded:

- `npm install` to install dependencies

- `gulp run` for running development server and preview

- `npm run dist` for generation task (Deploy)

- `gulp build` for define build task

- `gulp doc` to create documentation


This project uses *sass*, *sassdocs*, *javascript* and *JQuery*. Right now we are basing all of our layouts in flex box.

## Contributors

* [**List of Contributors**](Contributors.md): A page showing the GitHub usernames of all who have contributed to this project Doppler-UI-System! Make sure to add yourself and submit a pull request if you've contributed.

---
