Simplicity Programming Language
===============================

A language that minimizes complexity
--

Goals

* A language for the frontend
  * Compile to JavaScript so it runs in the browser
  * Useful for (web)apps
* Simplicity
  * unify synchronous and asynchronous function calls
  * minimize symbol and keyword clutter
  * gem/npm-style modules, requirejs by default
* Human readable
  * Something like Ruby/CoffeeScript-style control flow
* Expressive
  * Lodash as first class citizen/stdlib to provide functional toolbelt
* Reactive
  * Rendering should react to promises resolving automatically
  * Possibly wrap React

Strategy

* Build on top of JavaScript
* Abstract away lower level implementations like promises, modules and other things that introduce unneccessary complexity to source code
