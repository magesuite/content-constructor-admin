# Custom CC Components
Previous documentation guides serve as a point of reference for development of MageSuite core, 
however, the recent release (^4.1.0) introduced a support for Custom Content Contructor Components that can be defined in user's own custom modules.

## How to setup Content Constructor

Prerequisites: 
- `yarn` installed

Go to magesuite-content-constructor-admin module and run `yarn install`

Now the following tasks are available:

```
yarn build
yarn start
yarn lint
```

## How do custom components work?

During build there is a task `copyCustomComponents` executed which will search through the `vendor/*` folder for a directory with the specific name 

_magesuite-custom-content-constructor-components/_ 

and copies its content to `magesuite-content-constructor-admin/view/adminhtml/src/custom-components/`


This folder should have all custom components and their declarations:

- custom-components.ts

```
import helloWorldConfigurator from './components/hello-world/configurator/hello-world';
import helloWorldPreview from './components/hello-world/preview/hello-world';

export const customComponentsConfigurator = {
    'hello-world-configurator': helloWorldConfigurator,
};

export const customComponentsPreview = {
    'hello-world-preview': helloWorldPreview,
};

```

and also two .scss files with style imports for configurator and preview:

- custom-components-configurator.scss

```
@import './components/hello-world/configurator/hello-world';
```
- custom-components-preview.scss
    
```
@import './components/hello-world/preview/hello-world';
```

These will be imported automatically on to the Content Constructor.


> Note: If there are more than one magesuite-custom-content-constructor-components folders or none have been found - default (empty) entries will be copied from magesuite-content-constructor-admin/view/adminhtml/src/_custom-components/.


Then the default build task will run.

> In the end each project can have different content-constructor.js output file because it can have different custom components

In the past, we used to build and commit the output file. Now, the **build of content constructor assets needs to be triggered manually**


## How to create custom component?

There is a BE and FE work required, we have prepared an example of [custom Content Constructor component sample module](https://github.com/magesuite/content-constructor-sample-module/).

You can add it in your project:

```
"creativestyle/magesuite-content-constructor-sample-module": "^1.0.0",
```

As for creating the components using Vue, we recommend checking out other default components which can be found in _magesuite-content-constructor-admin/view/adminhtml/src/components_ and rely on it and the firts part of this documentation.
