# Project Spotify

This will be a personal project of mine, exploring and combining fun datasets. The goal is to create an interactive datavisualisation with [D3](d3js.org).

![](https://raw.githubusercontent.com/RobinFrugte97/Project-spotify/master/src/images/readmess.png)

## Concept

The concept an interactive network graph that links Spotify tracks to countries. Different countries are to be compared to see how these countries differ. A dataset of holidays is added to the combination to see if the holidays are an influence to the music choice of the country.

The user can select two different countries to compare. The user can also select which date they would like to see displayed. If a user wants to compare songs, they can click on the tracks circles to have the bound information displayed.

## Wiki

More about this project can be read here: [Wiki](https://github.com/RobinFrugte97/Project-spotify/wiki)

## List of datasets

This is a list of the datasets currently in use:

- [Worldwide top spotify songs per county, per day of 2017](https://www.kaggle.com/edumucelli/spotifys-worldwide-daily-song-ranking)
- [Top spotify songs of 2017 more detail](https://www.kaggle.com/nadintamer/top-tracks-of-2017)


I will be using a dataset containing the top 100 spotify songs for each day of 53 countries, for a year long.
For this project I will pick 10 different countries with as much difference in geographical location and culture between them.
The list of countries I will use in this application:
- Austria (at)
- Ecuador (ec)
- Hong Kong (hk)
- Finland (fi)
- Latvia (lv)
- Italy (it)
- Japan (jp)
- Netherlands (nl)
- New Zealand (nz)
- Turkey (tr)

## Usage

Because of the size of the data I have left the sets out of the package. They can be downloaded through the provided links above. 

The application can be run by running `ìndex.html`.

A repo named "Data" is required in the root of the application, containing all the downloaded datasets.


## Dependancies

There are no dependancies required. [Nodemon](https://www.npmjs.com/package/nodemon) was used for local developement, aswell as a local server.js file to serve the `index.html` file.
