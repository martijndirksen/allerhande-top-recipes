# allerhande-top-recipes

## Introduction
This little Node.js utility makes it easy to find recipes on AH Allerhande which are popular and rated high. Select the course you're interested in and it will create a ranking of recipes in the form of a text file (output.txt).

It works by directly communicating with the GraphQL endpoint of AH (and spoofing some headers to fool the endpoint to accept our requests :)).

## How to run

1. `Clone this repository`
2. `npm i`
3. `npm start`

## Licensing

This software is licensed under the [MIT license](LICENSE).