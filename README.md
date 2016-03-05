# Teleprompter

Teleprompter displays scripts formatted as HTML, Markdown, or plain text,
scrolling the script consistently. A second web browser can be attached to a
"control" view for that script, able to control or stop the scroll speed, jump
back to the top of the script, or even zoom and flip the text to conform to
different equipment needs.

## Usage

Teleprompter expects to be run against a directory of text files. If
unspecified, the current working directory is used instead.

```
Usage: teleprompter [OPTIONS] <scripts>

Options:
  <scripts>       A directory of scripts to load. [Default: .]
  --help, -h      Print usage information, then exit.
  --port, -p      Specify the port to listen on. [Default: 8080]
```

Teleprompter will run a web server at the configured port, so ensure the port
is available to use. A reasonable default, 8080, has been provided, and
shouldn't collide with other applications. (If it _does_ collide, you probably
know well enough to change it.)

## Routes

Once Teleprompter is running successfully, a web browser can be pointed at any
of the routes listed below, replacing `{script}` with the name of the script's
file, excluding the extension. For example, if you want to load the file
`glow-cloud.md` or `dog-park.html`, you would use `glow-cloud` or `dog-park` in
the URL, respectively.

Name | URL | Description
-----|-----|------------
Dashboard | `/` | Displays all available scripts and metadata for Teleprompter itself.
Script | `/{script}` | Displays the named script, rendering any Markdown to HTML.
Control | `/{script}/control` | Controls all Script displays for the named script.

## Browser Support

For best results, use the newest browser supported by your platform. For iOS
and Android, this will probably be Safari and Android, respectively. For older
phones and tablets, however, a more up-to-date browser may be available through
the App Store and Play Store. When [filing issues][new-issue], please let us
know the browser you ran into trouble with, and we'll see what we can do!

[new-issue]: https://github.com/Schoonology/teleprompter/issues/new

## Developing for Teleprompter

Two additional routes exist for internal synchronization of Control and Script
displays. Any event posted to the Publish route is sent to all clients attached
to the Subscribe socket, where `{namespace}` is any string, generally the name
of the script being displayed.

Name | URL | Description
-----|-----|------------
Subscribe (EventSource) | `GET /{namespace}/events` | An EventSource stream of updates.
Publish | `POST /{namespace}/events` | Pushes a new event to all subscribers.

These events arrive in the form of Objects with a `type` field and additional
metadata. Once connected, an initial blast with the latest of each of the
data-centric (e.g. `position`) events and their metadata to bring new Script
clients up to speed. The table below lists the available events and their
desired effects.

Name | Description
-----|------------
`content` | The content itself has been updated, and the Script client should reload.
`position` | The scroll position should be reset to `y`, defaulting to `0` (top).
`speed` | The scroll speed should be updated to `speed`, defaulting to `0` (stop).
