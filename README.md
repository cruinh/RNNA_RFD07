## Intro

This is a simple mobile app listing all pokemon reported by `pokeapi.co/api/v2/pokemon`.  

![preview image](https://raw.githubusercontent.com/cruinh/RNNA_RFD07/refs/heads/main/app_preview.png)

The point of this project is to be used as a development target for speedrunning the initial creation of a fresh react native app, both for practice and for exploring basic differences between new major versions of react native.

## Note

To reiterate: this is a **completed** attempt at the speedrun described below.  To attempt a run yourself, all you need is a working, local react native development environment, an internet connection, and the rules.

## Speedrun Rules

- use expo
- use ONLY useState and useContext for state management
- use pokeapi.co/api/v2/pokemon
- 2 screens
    1. a list of all pokemon pulled from the API
        - implement infinite scroll (40 per page)
        - implement pull-to-refresh
        - list cells should contain just the name of the pokemon
        - on-load the screen should pull the first 40 pokemon from the API
    1. a second screen that shows the details for a single pokemon
        - get pokemon number, sprites (front & back for each of default, female, shiny, and shiny female variants)
        - get 'flavor text'
        - display one flavor text entry at a time.  tap to cycle through available versions of the flavor text from diff games
        - display all the sprites
        - implement a scroll view so everything fits on the screen
        - pull-to-refresh on the scroll view

## How to run

You may wish to track your times running this exercise by using [LiveSplit](https://livesplit.org).  A set of splits for this program are provided in the `livesplit` folder at the root of the project. 