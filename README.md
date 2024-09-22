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

1. Build your image: `docker build -t <image-name> .`
2. Run the container: `docker run --name <container-name> -d -p 4000:4000 <image-name>`
3. Check running containers: `docker ps`
4. Check the logs of a container (if needed): `docker logs <container-name>`
5. Interact with the container (if needed): `docker exec -it <container-name> bash`
6. Stop the container (optional): `docker stop <container-name>`
7. Remove the container (if no longer needed): `docker rm <container-name> -f`
8. List images (optional): `docker image ls`

## Hot Reload

In Nodejs, in development stage, when you modify a file and you want to server to restart automatically when you save your changes, you need to use `Nodemon` package. Nodemon works by monitoring the file system for changes using a feature called file system events. When you modify a file, an event is triggered that Nodemon listens for, prompting it to restart your application as a _Hot Reload_. You need to add your `nodemon index.js` command into your Dockerfile. In this project, we add it through the package.json scripts into Dockerfile as `CMD [ "npm", "run", "dev" ]`.

Usually when we want to see a change affecting the containers' files, we need to remove the running container first, do the changes in local files in the machine, then build the image, and finally run the container. In order to bypass all these steps and make the container files syncs directly, we need to add a new flag to `docker run` command which is `-v`. This way, you don’t have to rebuild the Docker image every time you make a small change to your code. When using tools like Nodemon, changes in the local directory will trigger automatic reloads inside the container.

The `-v` flag in Docker is used to mount volumes or bind directories between your local machine and a Docker container. It allows you to share files and directories between your host machine and the container, making it easier to work with files during development.

Your run command will look like: `docker run --name <container-name> -v [host-path]:[container-path] -d -p PORT:PORT <image-name>`

### Configurations for Windows Users

:warning: **Important:** Due to different behaviors on operating systems, it is advisable to use absolute path for the [host-path] part as relative paths might may cause issues on Windows depending on how Docker is configured. For example, your command will looks like `docker run --name [container-name] -v C:/Users/Loai/Desktop/[project-name]:/app -d -p PORT:PORT [image-name]`. MacOS/Linux might not face the same issue and relative paths generally work fine with them.

After following the steps in this section, when running your localhost on Windows to test your local changes, you might notice that all local files mirrors the container files as expected but still you might not be able to see the changes. This is happening because Docker on Windows has to "translate" between the Windows file system and the virtualized Linux file system inside the container, and during this translation, file change notifications may not be passed through correctly. To solve the issue, you need to add a flag `--legacy-watch` in your Nodemon command to become `nodemon --legacy-watch index.js`.

`--legacy-watch` tells Nodemon to use an older, more compatible method of watching for file changes. It uses polling mode (legacy method) instead of File System Events (newer method). In polling mode, Nodemon continuously checks the file modification timestamps at regular intervals to see if a file has changed. While this is slightly less efficient than using file system events (because it uses more CPU cycles), it is much more reliable in environments where native file system watching doesn’t work well (such as Docker + Windows). Using polling mode might let you experience a slight delay between making a change and Nodemon detecting it. The polling interval is short, so the delay is typically not noticeable for small projects, but it can be an issue for larger ones.
