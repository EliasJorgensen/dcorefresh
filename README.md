# dcorefresh
>Node based CLI tool for refreshing docker-compose services

dcorefresh lets you update one or more docker-compose services through a simple CLI interface, so that you no longer will have to type a bunch of long service names.

***Refresh***: *The act of running stop, build and up on a docker-compose service. Yes, i made it up.*

## Installation and usage
In order to use dcorefresh, you will need to have docker-compose installed.

You can install dcorefresh by running the following command:  
`npm install -g dcorefresh`  

Now you can run it simply by doing:  
`dcorefresh`  
Now you will get a UI where you can choose the services that you want to refresh.

Note: make sure that you are in a directory with a `docker-compose.yml` file, or you will receive an error.

## Options
```sh
  -l       		Set length of page  		[number] [default: 20]
```
More coming soon 😇

## License
Licensed under MIT.