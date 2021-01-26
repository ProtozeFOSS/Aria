# Aria

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

When building for release there are a few directory paths that will need updated.

## Environment Variables

Under environment.ts and (prod) you'll find multiple file paths that are used through Aria.
>https://angular.io/guide/build
They currently work for deploy without any additional changes. A combination of environment variables and ng CLI command for build `base-href` and `deploy-url`. There is no `correct` way to deploy, this is dependent on your usecase.
>More about Angular deployment - https://angular.io/guide/deployment

For building Aria and deploying to a folder {webdomain}`/Aria`
>`ng build --prod --deploy-url "Aria/"` 


Most likely you want a folder on your webserver that contains the Aria build folder.
Some other location (or via back-end html injection) generate an iFrame that will reference the `index.html in Aria deploy folder` as the src attribute. This is critical as communication with Aria is done through the Window.message() API. 