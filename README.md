# COLOUR SORT

Colour Sort is a single player endless sorting game. It has increasingly difficult game levels to keep the player engaged and coming back for more. The aim of the game is to sort the shuffled stacks of blocks in to stacks of the same colour, which triggers a new game to start and increases the level.

The website can be viewed [here](https://davep33l.github.io/colour-sort/).

## Strategy

## Scope

### User Stories/Goals

## Structure

## Skeleton

### Wire-frames

![wireframe](readme/wireframes/block-sort-wireframe.png)

## Surface

### Typography

I wanted a playful font for the main logo title, one that was quite "blocky" to support the theme of "sorting blocks".

The font chosen for this was from google-fonts as per below.

1. [Rubik Doodle Shadow](https://fonts.google.com/specimen/Rubik+Doodle+Shadow)

![Rubik Doodle Example](readme/images/font-rubik-doodle-shadow.png)

### Colours

In the interest of accessibility for users/players who may have problems with distinguishing colours. I sourced a list of colours from [here](https://sashamaps.net/docs/resources/20-colors/), where the author has performed some research and testing on the best colour combinations.

For the game I selected the colours in which I felt were also pleasing to the eye and bold and bright enough for the game.

![Colours Screenshot](readme/images/colours.png)

### Images

## Features

- Auto randomising of coloured blocks to initiate a new level/game
- Ability to undo the previous move
- Ability to reset the current level
- Ability to add up to 2 supporting blocks to assist with level completion
- Endless gameplay

## Deployment

### Github Pages

This project was deployed to Github Pages using the following process:

1. Log in to Github
2. Ensure the relevant Github repository is selected
3. Navigate to the settings on the ribbon navigation bar
4. Ensure that the repository is set to public. This setting is at the bottom of the page in the "Danger Zone" section
5. Navigate to the pages section on the left navigation bar
6. Under Build and Deployment ensure the source is set to "deploy from branch"
7. Select "main" under the branch section and folder as "/root" and select save
8. Navigate to Actions on the ribbon navigation bar
9. There will be a "pages build and deployment" with a green tick if successful
10. Select this workflow action and there will be a link under the deploy aspect of the workflow
11. Select the link to view the site
12. The link for this site is https://davep33l.github.io/colour-sort/

### Images

| Image Purpose | Type | Author | Source | Additional info |
| ------------- | ---- | ------ | ------ | --------------- |
|               |      |        |        |                 |

## Technologies Used

### Languages Used

This game was created using HTML, CSS and vanilla Javascript.

### Frameworks, Libraries and Software Used

| What                                                 | Type             | Category        | Purpose                                                                                                                                                                                                    |
| ---------------------------------------------------- | ---------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Balsamiq](https://balsamiq.com/wireframes/desktop/) | Desktop Software | Wireframe       | This was used to create the wireframe for this project                                                                                                                                                     |
| [Git](https://git-scm.com/)                          | Desktop Software | Version Control | This was used as version control from the terminal inside VS Code and was pushed to a remote repository hosted by github.com                                                                               |
| [Github](https://github.com/)                        | Online Software  | Version Control | This was used to store the code used for the website and to host the website using github pages                                                                                                            |
| [VS Code](https://code.visualstudio.com/)            | Desktop Software | Development     | The was the application used to develop the website. I used some extensions to assist with the development. Those being: **_Live Server, Code Spell Checker, Markdown Preview Github Styling, Git Graph_** |

## Testing

### HTML Validator Testing

### CSS Validator Testing

### Lighthouse Testing

### Jshint Testing

### WAVE (Web Accessibility Evaluation Tool) Testing

### Manual Testing

### Bugs

The first major bug I encountered was adding the event handler to the stacks. I wanted to be able to maintain the context of this within the event handler function however my first iteration of the code returned this and event as the same. Below is my first iteration.

`this.domStackSection.getElementsByClassName(this.stackClass)[i].addEventListener('click', this.handleGameClicks);`

However, this was not returning the correct context of "this" (as I wanted it to reference the this properties within the class). After researching via google, I found a solution on stack overflow explaining how to access a class instance from an event handler ( [found here](https://stackoverflow.com/questions/44606399/typescript-how-to-access-the-class-instance-from-event-handler-method) ). I then researched in the MDN documentation and found supporting evidence to use an arrow function ( [found here](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#the_value_of_this_within_the_handler) ).

I therefore changed the line of code that was adding the event handler to the following:

`this.domStackSection.getElementsByClassName(this.stackClass)[i].addEventListener('click', (event) => this.handleGameClicks(event));`

I was then able to successfully see that the output of the below returned my desired results.

`console.log(this)` // returns the Game class object (previously returning the DOM element from the event)

`console.log(event.currentTarget)` // returns the DOM element from the event

`console.log(event.currentTarget === this)` // returns false (as now expected)

## Credits

### Code

### Content

### Media

### Acknowledgements

To help maintain consistency with my git commits, I have utilised a local template highlighted in [this](https://blog.ossph.org/how-to-write-a-good-git-commit-message/#setting-up-a-commit-message-template) article.

In the interest of accessibility, I searched for colours that were unique enough, but maintained a enough contrast/difference to be distinguishable. This lead me to [this](https://sashamaps.net/docs/resources/20-colors/) website with a great resource of colours trying to solve a similar problem but for subway map lines. I selected a list of colours from this which I deemed appropriate for the game.
