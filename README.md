# ROS Web Image Viewer

[status]: https://dev.mcgillrobotics.com/buildStatus/icon?job=ros-web-image-view/master
[url]: https://dev.mcgillrobotics.com/job/ros-web-image-view/job/master
[![status]][url]

This is an Electron application client to interface with `web_video_server` the
same way `image_view` does.

The point of this application is to have finer control over the bandwidth of
your image stream in less ideal network environments.

## Setting up

You must clone this repository as `web_image_view` into your catkin workspace:

```bash
git clone https://github.com/mcgill-robotics/ros-web-image-view.git web_image_view
```

## Dependencies

Before proceeding, make sure to install all the dependencies by running:

```bash
rosdep update
rosdep install web_image_view
```

## Compiling

You **must** compile this package before being able to run it. This will
install all `npm` dependencies, so an internet connection is required the first
time. You can do so by running:

```bash
catkin_make
```

from the root of your workspace.

On Ubuntu, you might also need to symlink `nodejs` to `node` for this to work.
This can be done as follows:

```bash
sudo ln -s /usr/bin/nodejs /usr/bin/node
```

## Running

To run simply launch the `web_video_server` on the remote machine as such:

```bash
rosrun web_video_server web_video_server
```

and run this application on your client as such:

```bash
rosrun web_image_view web_image_view <IMAGE_TOPIC_NAME> --server=<REMOTE_ADDRESS>
```

### Arguments

The following command-line arguments can be set:

-   `--server`: Full address of `web_video_server` including port,
    default: `http://localhost:8080`
-   `--type`: Stream type (one of `mjpeg`, `vp8`, `ros_compressed`), default:
-   `mjpeg`.
-   `-w, --width`: Image width to stream, default: `400` pixels.
-   `-h, --height`: Image height to stream, default: `300` pixels.
-   `-q, --quality`: Image quality (between 0 and 100%), default: `30`.
-   `--help`: Displays usage information and exists.

## Interaction

### Resizing

Resizing the window changes the resolution of the stream. In other words, a
larger window will use more bandwidth than a smaller one. Nevertheless, the
window is resizable at run-time. *Note that you may notice a small lag in the
stream when resizing due to the stream being reset.*

### Screenshot

You can save a screenshot of the current frame by right-clicking on the image.
This will pause the stream and prompt you for a file name and location to save
the screenshot to.

### Quality

The quality setting can be changed in real-time using the following keyboard
shortcuts:

-   `1`: Sets the quality to 10%.
-   `2`: Sets the quality to 20%.
-   `3`: Sets the quality to 30%.
-   `4`: Sets the quality to 40%.
-   `5`: Sets the quality to 50%.
-   `6`: Sets the quality to 60%.
-   `7`: Sets the quality to 70%.
-   `8`: Sets the quality to 80%.
-   `9`: Sets the quality to 90%.
-   `0`: Sets the quality to 100%.
-   `+`: Increases the current quality setting by 5%.
-   `-`: Decreases the current quality setting by 5%.
