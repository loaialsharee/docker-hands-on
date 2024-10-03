# Docker Learning Guideline _by [Loai](https://www.linkedin.com/in/loai-alsharee/)_

![Docker Logo](https://static1.howtogeekimages.com/wordpress/wp-content/uploads/csit/2021/04/075c8694.jpeg?q=50&fit=crop&w=1000&h=500&dpr=1.5)

Docker is an open-source platform designed to automate the deployment, scaling, and management of applications. [Docker's official website](https://www.docker.com/) states that "it helps developers build, share, run, and verify applications anywhere — without tedious environment configuration or management".

## Docker Concepts

There are several concepts that are crucial to grasp when it comes to learning Docker:

1. **Dockerfile**: A text file/doc that contains a series of instructions, dependencies, or commands to run on the command line to build and assemble an image.
2. **Image**: A derivative of the assembled Dockerfile, read-only templates, and executable files used to create containers.
3. **Container**: A standalone, standard, and executable unit of software that packages up code and its dependencies and contain everything needed to run an application.
4. **Docker Engine**: The main technology that enables containerization. It consists of Docker daemon, Docker client, and other components.
5. **Docker Hub**: A cloud-based repository/registry which enables users to store, share, and distribute Docker images - like Github.

## Docker Commands

This section denotes the commands you may need to use in your daily practice. Each command listed below will have a brief explanation which you may refer to grasp its purpose.

1. `docker build -t <image-name> .`

   **Purpose**: builds a Docker image from a Dockerfile located in your current directory (`.`)

   - `docker build`: This tell Docker to create a new image from the instructions in Dockerfile.
   - `-t <image-name>`: The `-t` flag stands for _tag_. It allows you to give a name and optionally a version tag to the image you're building.

---

2. `docker run --name <container-name> -d -p PORT:PORT <image-name>`

   **Purpose**: starts a new Docker container from the image you built from the previous command.

   - `docker run`: The `run` command creates and starts a new container from an image.
   - `--name <container-name>`: The `name` flag allows you to give a specific name to your container, making it easier to reference later.
   - `-v`: This flag is used to mount volumes or bind directories between your local machine and a Docker container. [Read more on how to use it](#hot-reload).
   - `-d`: This flag This flag stands for detached mode, which means the container will run in the background. If you don’t use it, the container will run in the foreground and block your terminal. You may use this flag so that you don't see logs from Docker in your terminal.
   - `-p PORT:PORT`: The `-p` flag maps the container's internal port to a port on your machine. In this case, you're mapping port 4000 of the container to port 4000 of your machine (`containerPORT:machinePORT`), allowing you to access the app running inside the container via localhost:4000.

---

3. `docker ps`

   **Purpose**: lists all currently running conatainers.

   - `docker ps -a`: The flag `-a` lists all containers including stopped ones.

---

4. `docker logs <container-name>`

   **Purpose**: views the logs of a running (or stopped) container. It can help troubleshooting and understanding what's happening inside your containerized application.

   - `-f` continuously stream the logs in real time. It keeps logs open in your terminal, and you can see new log entries as they are generated, for example: `docker logs -f <container-name>`

   - `-t` includes timestamps with each log line, for example: `docker logs -t <container-name>`

   - `--since` & `--until` fetch logs from a specific time range. For example: `docker logs --since "2023-09-22T00:00:00" <container-name>` OR `docker logs --until "5m" <container-name>` (logs from the last 5 mins)

---

5. `docker exec -it <container-name> bash`

   **Purpose**: This command lets you interact with a running container by opening a Bash shell inside it.

   - `docker exec`: executes a command inside a running container.
   - `-it`: these are two flags combined:
     - `-i` stands for _interactive mode_, keeping the session open.
     - `-t` allocates a _pseudo-TTY_, basically giving you a shell-like interface.
   - `bash`: a command that will run inside the container to open a bash shell.

---

6. `docker image ls`

   **Purpose**: lists all the images available on your system. This shows the images you have built or pulled, along with details like the image ID, size, and creation time.

---

7. `docker rm <container-name> -f`

   **Purpose**: removes/deletes a container.

   - `docker rm`: It removes a container
   - `-f`: This flag forces the container to stop and removes it, even if it's still running. Without `-f`, Docker will not remove running container, so you have to stop the container first with `docker stop <container-name>`

---

### Recommended Commands Sequence

:information_source: You might need to look into [Windows Configurations](#configurations-for-windows-users) if you are following this guide using Windows OS.

1. Build your image: `docker build -t <image-name> .`
2. Run the container: `docker run --name <container-name> -d -p 4000:4000 <image-name>`
3. Check running containers: `docker ps`
4. Check the logs of a container (if needed): `docker logs <container-name>`
5. Interact with the container (if needed): `docker exec -it <container-name> bash`
6. Stop the container (optional): `docker stop <container-name>`
7. Remove the container (if no longer needed): `docker rm <container-name> -f`
8. List images (optional): `docker image ls`

## Hot Reload & Volumes

In Nodejs, in development stage, when you modify a file and you want to server to restart automatically when you save your changes, you need to use `Nodemon` package. Nodemon works by monitoring the file system for changes using a feature called file system events. When you modify a file, an event is triggered that Nodemon listens for, prompting it to restart your application as a _Hot Reload_. You need to add your `nodemon index.js` command into your Dockerfile. In this project, we add it through the package.json scripts into Dockerfile as `CMD [ "npm", "run", "dev" ]`.

Usually when we want to see a change affecting the containers' files, we need to remove the running container first, do the changes in local files in the machine, then build the image, and finally run the container. In order to bypass all these steps and make the container files syncs directly, we need to add a new flag to `docker run` command which is `-v`. This way, you don’t have to rebuild the Docker image every time you make a small change to your code. When using tools like Nodemon, changes in the local directory will trigger automatic reloads inside the container.

### Two-Way Binding

The `-v` flag in Docker is used to mount volumes or bind directories between your local machine and a Docker container. It allows you to share files and directories between your host machine and the container, making it easier to work with files during development.

Your run command will look like: `docker run --name <container-name> -v [host-path]:[container-path] -d -p PORT:PORT <image-name>`

:warning: This will cause any change in either the local machine or the Docker container to reflect on the other accordingly.

### One-Way Binding

You may need this if you wish you local machine changes to reflect directly on your Docker container only (one way), while any changes in the Docker container will NOT reflect any changes on your local machine.

Your run command will look like: `docker run --name <container-name> -v [host-path]:[container-path]:ro -d -p PORT:PORT <image-name>`

We added `:ro` after the container path indicating _Read-only_.

But, what happens if I delete, for example, `node_modules` from my local machine? As you have guessed, `node_modules` will also be deleted from the container's files and therefore crashing the running application. How should we solve that? Welcome to [Anonymous Volumes](#anonymous-volumes).

### Anonymous Volumes

These volume has no host directory specified (unlike the first ones), so Docker will automatically create an anonymous volume to store the data in the specified directory such as `/app/node_modules` inside the container. The container can write to this volume (since it’s not read-only), and the data physically persists as long as the volume exists, meaning that even if you remove the container, your volume will still be there (not flushed).

Your run command will look like: `docker run --name <container-name> -v [host-path]:[container-path]:ro -v </container/path/to/file> -d -p PORT:PORT <image-name>`

Now, even if you delete `node_modules` are deleted in your local, your application on the container will still be running, but you might notice the modules are removed from your container as well (when you use `docker exec...` command to view the content of the container files). Don't worry, `node_modules` are still there. As we said, the data persists as long as the volume exists, so if you remove/delete the container and run it back, you will see the modules coming back again (even though your modules are deleted from your local machine). You may navigate to Docker Desktop -> Volumes to view your available volumes. That explains why the application was still running and not crashed in the container.

Is there a simpler solution? Of course!

### Alternative Solution

In Ideal world, we maintain our main source files within a folder called `src`. Therefore, when we do the one-way binding, we will do it this way `-v $(pwd)/src:/app/src:ro`. This way you will ensure that the files within the `src` folder will only mirror the changes with the container's src folder, leaving the outsider files safe and untouched from changes or modifications. If you wish to follow this way, don't forget to update your `package.json` scripts to `nodemon --legacy-watch src/index.js` so it can navigate to `src` to read your files correctly.

If you face any challenges seeing your updates, try to build the image again and try run.

## Docker Compose

**Docker Compose** is a tool used for defining and running multi-container Docker applications. Instead of managing individual Docker containers manually, Compose assists in automating and managing complex environments with a simple, declarative approach by setting containers, their configurations, and how they interact with each other in a single YAML file, usually called `docker-compose.yml`.

Key Concepts in Docker Compose:

1. **Service**: a definition of a container that is part of your application (e.g. web, database, cache, backend).
2. **YAML File**: Describes how your application is composed of multiple services in `docker-compose.yml`.
3. **Networking**: Compose sets up networking between containers so they can communicate with each other.
4. **Volumes**: Helps you manage persistent storage within the configuration.
5. **Scaling**: You can scale services up or down for load balancing or redundancy.

To run your docker compose, run `docker-compose up -d`. `-d` is used to activate detach mode as before.
To shut down your docker compose, run `docker-compose down`.

Here is a simple structure of [how to define a basic Compose file for your project](https://docs.docker.com/compose/gettingstarted/#step-2-define-services-in-a-compose-file).

The above commands will work if you have a single `docker-compose.yml` file in your project. The next section will guide you how to manage multiple files (indicating multiple envs) in your project.

### Environment Variables and Docker Environments

When publishing your application, you will need environment variables to be utilised within your application. For that, in your `docker-compose.yml`, add the following block in under your defined service:

```
env_file:
   - ./.env
```

This is supposed to inform your Docker Compose file that path to your `.env` file where you store your environment variables. If you wish to declare specific envs for different Docker environments, use:

```
environment:
   - yourEnv=<whatever>
```

Whenever you plan to split your application to different environments (e.g. development, staging, production, etc.), you may need to create a specific Docker Compose file for each environment. Suppose we're only having _DEV_ and _PROD_ for this example. We will need to create two Docker Compose file as follows:

**Development**: `docker-compose.dev.yml`

```
services:
  node-app:
    container_name: <your-container-name>
    build: .
    volumes:
      - ./src:/app/src:ro
    ports:
      - "<port>:<port>"
    environment:
      - NODE_ENV=dev
    env_file:
      - ./.env
```

**Production**: `docker-compose.prod.yml`

```
services:
  node-app:
    container_name: <your-container-name>
    build: .
    ports:
      - "<port>:<port>"
    environment:
      - NODE_ENV=prod
    env_file:
      - ./.env
```

_Note: We have removed volumes as we don't want any mirroring in the prod env_

In this scenario, we can use the following commands to run the specific docker compose environment file:

`docker-compose -f <specific-docker-compose-file> up -d`
`docker-compose -f <specific-docker-compose-file> down`

But in reality, we don't want to keep duplicating the content in each environment. What if we want to add/modify a service or a configuration? We will have to repeat the same setting in all Docker Compose files making it a cumbersome. Therefore, a common practice is that we can save the common configuration in a `docker-compose.yml` file and keep only the parts that differ within the environment specific file to avoid repetition. The following is an example:

**Main Docker Compose File**: `docker-compose.yml` (for all environments)

```
services:
  node-app:
    container_name: <your-container-name>
    build: .
    ports:
      - "<port>:<port>"
    env_file:
      - ./.env
```

**Development**: `docker-compose.dev.yml`

```
services:
  node-app:
    volumes:
      - ./src:/app/src:ro
    environment:
      - NODE_ENV=dev
```

**Production**: `docker-compose.prod.yml`

```
services:
  node-app:
    environment:
      - NODE_ENV=prod
```

If you wish to use this way, use the following commands to run your specific environment docker compose file. Bear in mind that `<common-docker-compose-file>` here refers to `docker-compose.yml` file, in this example, while `<docker-compose-env-file>` refers to either `docker-compose.dev.yml` or `docker-compose.prod.yml`

`docker-compose -f <common-docker-compose-file> -f <docker-compose-env-file> up -d`
`docker-compose -f <common-docker-compose-file> -f <docker-compose-env-file> down`

For the environments that do not have the volumes for mirroring, you might need to rebuild using the following command, in case you got changes that want them to be reflected:
`docker-compose -f <common-docker-compose-file> -f <docker-compose-env-file> -d --build`

## Working with multiple environments on Dockerfile & Multi-Stage Dockerfile

Once you allow your app to run on different environments as explained in the previous section, you might face a situation where you want to run `npm run dev` for development within Dockerfile and `npm start` for production. Although instantiating Dockerfile to multiple environments is possible, yet it will not be practical if there is a change you want to add later on as that change might need to be added to all Dockerfiles one-by-one.

One way to allow your Dockerfile work for multiple environment is the following:
If you want to override `CMD [ "npm", "run", "dev" ]` so that it works as `npm run dev` for dev and `npm start` for prod is to add the following to your docker compose files:

- For `docker-compose.dev.yml`, add `command: ["npm", "run", "dev"]`
- For `docker-compose.prod.yml`, add `command: ["npm", "start"]`

Example:

```
services:
  node-app:
    build:
      context: .
      args:
        - NODE_ENV=dev
    volumes:
      - ./src:/app/src:ro
    environment:
      - NODE_ENV=dev
    command: ["npm", "run", "dev"]  // see the command added here
```

You may keep the CMD command as it is in your Dockerfile as the commands shown above will override that one and it would reflect your env.

Now, we're done with running the command! How about `npm install`? We are worried that in production we might install `nodemon` there as well. We want to keep it only for dev environment. Here is how we can solve that:

1. Remove `build: .` from `docker-compose.yml` as that would not be common among all envs anymore.
2. In Dockerfile, remove `RUN npm install`, and add the following lines instead:

```
ARG NODE_ENV

RUN if [ "$NODE_ENV" = "prod" ]; \
    then npm install --omit=dev; \
    else npm install; \
    fi

```

`ARG` states for **Argument**. It's the parameter we will pass from Docker compose to tell Dockerfile what env we are using.
The purpose of the above block is to say, if `NODE_ENV` is dev, we want to run `npm install --omit=dev`, and if `NODE_ENV` is prod, we want to run `npm install`. So your Dockerfile would look like:

```
FROM node:20

WORKDIR /app

COPY package.json .

ARG NODE_ENV

RUN if [ "$NODE_ENV" = "prod" ]; \
    then npm install --omit=dev; \
    else npm install; \
    fi

COPY . .

EXPOSE 4000

CMD [ "npm", "run", "dev" ]
```

Side note, `--omit=dev` omits all the devDependencies packages when it installs your packages, ensuring only installing commands that are ready for prod (a.k.a without nodemon)

3. In your `docker-compose.dev.yml`, add the following block:

```
    build:
      context: .
      args:
        - NODE_ENV=dev
```

and for your `docker-compose.prod.yml`, add the following block:

```
    build:
      context: .
      args:
        - NODE_ENV=prod
```

`args` here tells Dockerfile what environment we are running.

Finally, we need to use this command in the terminal to run it:
`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build`

Change `docker-compose.dev.yml` to `docker-compose.prod.yml`if you want to run your production containers.

:warning: Based on my notice if you run your `docker-compose.dev.yml` and then stop the container and try to build again to run on `docker-compose.prod.yml`, your `node_modules` might get cached, so you might still see devDependency packages inside your production modules. Don't panic. Just use the following command to **clean Docker build**:
`docker-compose -f docker-compose.yml -f docker-compose.prod.yml down --rmi all`

`--rmi` stands for _remove images_. It allows you to specify whether or not Docker should remove the images used by your services when taking down the containers.

### Multi-Stage Dockerfile

Another way for you to allow Dockerfile accommodate different stages or environments is to introduce how you expect it to handle each stage using `as <env>`.

Also, you may use `base` to help you configure the instructions that need to run in common before starting your specific environment configurations. Your Dockerfile might look like this:

```
FROM node:20 as base


FROM base as dev

WORKDIR /app
COPY package.json .
ARG NODE_ENV
RUN npm install
COPY . .
EXPOSE 4000
CMD [ "npm", "run", "dev" ]


FROM base as prod

WORKDIR /app
COPY package.json .
ARG NODE_ENV
RUN npm install --omit=dev
COPY . .
EXPOSE 4000
CMD [ "npm", "start" ]
```

If you wonder how Dockerfile will know which stage/env you are introducing, we still need to do a slight adjustment on docker-compose files as well.

Replace your `args` block with `target: <env>`, so your `docker-compose.prod.yml` file will look, for example, as follows:

```
services:
  node-app:
    build:
      context: .
      target: prod  // we added this
    environment:
      - NODE_ENV=prod
    command: ["npm", "start"]

```

## Configurations for Windows Users

:warning: **Important:** Due to different behaviors on operating systems, it is advisable to use absolute path for the [host-path] part as relative paths might may cause issues on Windows depending on how Docker is configured. For example, your command will looks like `docker run --name [container-name] -v C:/Users/Loai/Desktop/[project-name]:/app -d -p PORT:PORT [image-name]`. MacOS/Linux might not face the same issue and relative paths generally work fine with them.

If you do not wish you use the lengthy absolute path, you may shorten it using `$(pwd)` command. If you are using If you’re using Git Bash on Windows, it automatically converts Unix-style paths (/c/Users/...) into Windows-style paths (C:/Users/...). However, sometimes this automatic conversion interferes with Docker's ability to bind the mount properly.

You can disable Git Bash's path conversion by setting the `MSYS_NO_PATHCONV=1` environment variable, like this:
`MSYS_NO_PATHCONV=1 docker run --name <container-name> -v $(pwd):<container-path>:ro -d -p PORT:PORT <image-name>`

After following the steps in this section, when running your localhost on Windows to test your local changes, you might notice that all local files mirrors the container files as expected but still you might not be able to see the changes. This is happening because Docker on Windows has to "translate" between the Windows file system and the virtualized Linux file system inside the container, and during this translation, file change notifications may not be passed through correctly. To solve the issue, you need to add a flag `--legacy-watch` in your Nodemon command to become `nodemon --legacy-watch index.js`.

`--legacy-watch` tells Nodemon to use an older, more compatible method of watching for file changes. It uses polling mode (legacy method) instead of File System Events (newer method). In polling mode, Nodemon continuously checks the file modification timestamps at regular intervals to see if a file has changed. While this is slightly less efficient than using file system events (because it uses more CPU cycles), it is much more reliable in environments where native file system watching doesn’t work well (such as Docker + Windows). Using polling mode might let you experience a slight delay between making a change and Nodemon detecting it. The polling interval is short, so the delay is typically not noticeable for small projects, but it can be an issue for larger ones.
