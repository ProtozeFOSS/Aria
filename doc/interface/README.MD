## Aria Interface Description

There are 3 'interfaces' to work with and adjust in Aria.
2 Object are User Experience Settings related, the 3rd is the core Aria backend.

* Theme (Ux - Color and Size Settings)
* Layout (UX - Position Settings)
* Aria (Core - Chess/PGN related)

## **Aria Settings**

There are two methods to pass settings.
### `1.) By URL`
-------------
  applies the settings before the initialization of any user interface components. So the settings are visually seamless. To pass settings be URL:
  - Create JS settings object.
    - *With 3 root objects.*
        - `Layout`
        - `Theme`
        - `Aria`
  - Convert JS settings object to string.
  - Convert the JS string to base64.
  - Pass the base64 string to **Aria** using the `settings` URL parameter.

`/aria.html?settings=eyJ0aGvtZXMiOnsiLs1nc1R1eHRDb2xvclBDIjox1`

***By URL** is the preferrred method for encoding settings served from a **Web Server**.*


### `2.) By JS Method`
------
Using the aria.js file, developers can pass settings asynchronously from client side. This allows integration with other data fetching methods and asynchronous techniques. Or if desired a custom menu can be used. To pass data by method, get an instance/handle to the Aria iframe you wish to change and then call the appropriate methods. 

`Colors and font sizes` are passed through the `setTheme` method.

`Layout and Components` are passed through the `setLayout` method.


### `setTheme(theme: Object)`

----------
```
  var theme = {gsFontSize:22, gsFontColor:'white'};

  var aria = new Aria('aria-iframe-id');
  ...
  aria.setTheme(theme);
```
 Only valid variables names will be used (so check closely). There is no error checking on the value. If you decide to send the game score text color as string `rad` instead of string `red` - you can. It just wont work!😉 Send valid color strings only.

Below is a table to help developers/users understand the variables available.

### `Prefix Table`
> A Prefix is used for all variable names. This helps declare the target parent component.
> - Game Score
> - Header
> - Controls
> - Board
> - Status

| Name | Prefix |
|:------------|:--------:|
| Game Score  | `gs` |


### `Suffix Table`
>The suffix is only used in complicated Ux components like the header and score elements.
> Allowing more visual control for the end user styling.

| Name | Suffix |
|:------------|:--------:|
| Annotation  | `AN` |
| Ply Count   | `PC` |
| Variation   | `VA` |

Following the above chart, the Font Color property for the Game Score Annotation element.
`gs` + `Font` + `Color` + `AN` = `gsFontColorAN`

Font Size for the same element
`gs` + `Font` + `Size` + `AN` = `gsFontSizeAN`

Font Family for the same element
`gs` + `Font` + `Family` + `AN` = `gsFontFamilyAN`

`Colors` are strings. `Sizes` are numeric values (can contain a fraction, 12.5).

| Name | Type  | Description |
|:--------------:|:-----:|:-------------------:|
| gsTextColor
### `setLayout(layout: Object)`


# User Experience
The user interface can be configured using the Aria Menu.
The Aria Menu and Aria itself do not share a codebase. This allows other menus to be developed for Aria and integrated seamlessly. 





