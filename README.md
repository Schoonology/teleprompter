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
View | `/{script}` | Displays the named script, rendering any Markdown to HTML.
Control | `/{script}/control` | Controls all View displays for the named script.

## Browser Support

For best results, use the newest browser supported by your platform. For iOS
and Android, this will probably be Safari and Android, respectively. For older
phones and tablets, however, a more up-to-date browser may be available through
the App Store and Play Store. When [filing issues][new-issue], please let us
know the browser you ran into trouble with, and we'll see what we can do!

[new-issue]: https://github.com/Schoonology/teleprompter/issues/new
