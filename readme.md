# _A simple To Do List App_

![Screen Shot 2022-02-27 at 17 32 34](https://user-images.githubusercontent.com/20937211/155911061-3551a9d8-2683-49b9-a615-e2eb543e2054.png)

> In this project i'm using EJS - a templating library to generate HTML markup with plain Javascript. For database i'm using mongoDB installed localy and running on localhost. CSS built from scratch.

## Installation

Step 1. In the project directory, you can run:

```sh
npm install
```

Step 2. You also must install MongoDB on your **local machine**.

```sh
'install MongoDB locally, find the details also @ MongoDB Docs'
```

Step 3. IMPORTANT:

> You must Create a New File in the project directory "nodemon.json" in order to connect to YOUR OWN MongoDB Online.
> In this file include the following lines:

```sh
{
	"env": {
		"DB_USER": "YOUR_MONGO_DB_USER_NAME",
		"DB_PASSWORD": "YOUR_MONGO_DB_PASSWORD",
		"DB_NAME": "todolistDB"
	}
}
```

## Usage

```sh
nodemon app.js
```

Verify the deployment by navigating to your server address in
your preferred browser.

```sh
http://localhost:3000
```

The page will reload if you make edits.<br>
You will also see any lint errors in the console.
