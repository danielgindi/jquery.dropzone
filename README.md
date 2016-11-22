# jquery.dropzone
A simple jquery plugin for creating styleable dropzones for files

* Call `$('#your-element').dropzone()` to initiate
* Adds `drop-available` class to the dropzone element when a file is being dragged to the window. This is useful if you want to style your element to show that it is possible to drop the file on it.
* Adds `drop-over` class to the dropzone when the file is being dragged right over it.

---

It's possible to instruct it to add an extra element inside the dropzone when a file is being dragged to the window, 
which will also receive the `drop-over` class.  
This is useful for creating a dropzone on `body`, and having a styled dropzone element float above everything else.

This is done by passing an `append` option:

```
$('body').dropzone({ append: 'dropzone-inner' })
```

Now just listen to 'drop' event and take the file:
```
$('body')
    .dropzone({ append: 'dropzone-inner' })
    .on('drop', function (event) {
        event.preventDefault();

        // Do something with the files
        console.log(event.originalEvent.dataTransfer.files);
    });
```

Remember, you need to `preventDefault()` on the event, or the browser will use the default action on the dropped file, which is to download it or redirect to the file.

---

### Cleanup

```
$('#your-element').dropzone('destroy');
```

The plugin will be automatically cleaned up when the `remove` event is emitted (Either when jQuery.UI is present, or [jquery.removeevent](https://github.com/danielgindi/jquery.removeevent) is present).
