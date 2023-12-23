# Google Keep Clone

## Live Site URL

[Google Keep Clone](https://glowing-gaufre-8c9f79.netlify.app/)

## Overview

This project was built as part of [Scrimba's JavaScript Deep Dive Course](https://scrimba.com/learn/javascript).  Notes are saved in local storage and can be organized by color (white, orange, purple, or teal).  I largely kept this project as-presented with few minor changes, with one exception.  The original project used innerHTML in the displayNotes method, and as that's not best practice I refactored the code for dynamically building the notes HTML.  The updated version contains methods for the note elements using createElement and appends those onto the notes div.

I also couldn't get the icons that were presented in the course to work locally, so I used svgs from [Font Awesome](https://fontawesome.com/) for my icons.