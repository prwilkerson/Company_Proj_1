# Guidelines
You will have to submit this task with git (you can use Github or Bitbucket). 
After you are finishing make sure the code is pushed and send an email/skype with a link.

The code should be runnable on Chrome (don't warry about the rest), NPM start or something simple for run it.

Stack: React, Redux, Rxjs (or similar  lib), ES6/ES7 or Typescript

We are looking for best practices, maintainability, knowledge general programming skills/abilities

## You have this model
```typescript
interface Asset {
	id: number
	assetName: string; // "USD", Samsung Electronics Co Ltd : "SSNLF"
	price: number; // asset current price relative to USD
	lastUpdate: number; // unix timestamp
	type: "Currency" | "Stock"; // asset type Currency (e.g. USD, EUR...) or Stock (Samsung, Google)
}
```

## Mock 

Creates 400 random assets, 200 currencies and 200 stocks (just the types is iterating, you don't need real assets) id 1-400

Create a stream from those 400 assets that fires 1 update per secound for each asset:
* price must be changed each update by -1 to 1 and with the current timestamp, the rest will stay the same

you can find the mock at mock.js
It exports a mock, rxjs observable with the required stream

This is not a starter or boilerplate it is just to confirm that the mock isn't broken
You still can boot your project how ever you want

### see the mock running
npm/yarn install
npm test

You should see console log with the object on the steam


## Create the following app using this stream:

* Show a table with all of the assets
* The prices should be updating every second as described above
* Allow to sort for each one of the model fields
* Allow to filter for each one of the model fields

**Optional**

* Add to favorites button
* favorites should be persist  to localstorage
* favorites should be pin to the top of the table




**
**
** To Run my example**
Open Chrome browser with the "index.html" and see it run

Select the "Run" checkbox to start running the Mock changes where it will increment or decrement for the "Price" and update the "Last Update".

Also the Checkboxes on top can be used to filter out the columns for "ID", "Price", and etc...

I did not have time to implement the optional Favorites, as time is crucial to complete this project.
