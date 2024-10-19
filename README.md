# AI Video Coding Interview
[Online Demo: https://alextmn.github.io/bug-flap-game/](https://alextmn.github.io/bug-flap-game/)
![AI Video Coding Interview](ai-codinging-interview-1.gif)

This project demonstrates how to use hand gestures in a browser with AI running as WebAssembly. It utilizes [MediaPipe](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker), a framework developed by Google, which processes and tracks hand gestures in real time. The project runs TensorFlow directly in the browser for gesture recognition, leveraging WebAssembly for fast, efficient execution without needing backend infrastructure.

This setup highlights the power of on-device machine learning for browser applications, offering fast, private, and interactive AI experiences.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.1.


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

`ng build  --configuration production --base-href "/bug-flap-game/"`
`npx angular-cli-ghpages --dir=dist/bug-flap-game/browser`

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
