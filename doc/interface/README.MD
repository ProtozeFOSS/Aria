## Aria Interface Description

There are 3 'interfaces' to work with and adjust in Aria.
2 Object are User Experience Settings related, the 3rd is the core Aria backend.

* Theme (Ux - Color and Size Settings)
* Layout (UX - Position Settings)
* Aria (Core - Chess/PGN related)

## **Methods for configuring Aria Settings**

There are two methods to pass settings.
# `1.) By URL`
  applies the settings before the initialization of any user interface components. So the settings are visually seamless. To pass settings be URL:
  1. Create JS settings object.
  > *With 3 root objects.*
    - `Layout`
    - `Theme`
    - `Aria`
  2. Convert JS settings object to string.
  3. Convert the JS string to base64.
  4. Pass the base64 string to **Aria** using the `data` URL parameter.

`Aria/?data=eyJ0aGvtZXMiOnsiLs1nc1R1eHRDb2xvclBDIjox1`

> ***By URL** is the preferrred method for encoding settings served from a **Web Server**.*
> Below are detailed tables on the available URL values for each service
## `Aria Service`
The aria service works as the core. Bringing the engine together with the visual components, the responsibility of the service is to synchronize the two. Actions performed in the UX need to be passed to the engine. Events within the engine, must propagate back to the UX.
| Property | Type | Default | Description |
|:---------|:-----------| :------: |--------:|
| `fen` | *Valid FEN string*  | | Sets the starting fen position of th engine and board (ignored if PGN also supplied) |
| `pgn` | *number*  |  | Sets the PGN to the engine **Be careful not to overflow source property! If the PGN is VERY large, pass it with the `loadPGN` JS method on Aria at runtime.** |
| `game` | *number (int)* |  | Sets the starting game (starts at 1) |
| `startPly` | *number (int)* |  | Sets the starting move |
| `interactiveBoard` | *boolean (int)* |  | Sets if the board is interactive |
| `interactiveControls` | *boolean (int)* |  | Sets if the controls are interactive |
| `interactiveScore` | *boolean (int)* |  | Sets if the moves are interactive |
| `keymap` | *object=>{KeyName:ActionID}* |  | Sets the assigned keymap |

## **User Experience -** *Layout and Theme Details*
The user interface can be configured using the Aria Menu.
The Aria Menu and Aria itself do not share a codebase. This allows other menus and controls to be developed for Aria and integrated seamlessly. For instance, Aria by default is actually just a wrapper around Canvas Chess Board. Turn on the score, and you have a board that can be navigated by the score alone. Turn on only the controls, you have a "blind" game that can be navigated on autoplay. Enable header, score, controls, and status and you have a full blown "PGN Viewer". A combination of enabling interactive flags in Aria service and enabling components in the layout service, allows Aria to adapt to different applications. 
>Below are tables to help developers/users understand the variables available and how to set them.

## `Layout Service`
The layout service helps tune the what and where of the UX. Handling higher level layout decisions, this service is capable of drastically changing what "Aria" is.

| Property | Type | Default | Description |
|:---------|:-------------:|:-------:| --------:|
| `header` | *boolean (int)*  | **false** | Enables the header visual element |
| `score` | *boolean (int)*  | **false** | Enables the score visual element |
| `controls` | *boolean (int)* | **false** | Enables the controls visual element |
| `status` | *boolean (int)* | **false** | Enables the status visual element |

## `Theme Service`
 Understanding the variable naming system might help you understand the structure of the internal theme service. The theme service is used to **style** Aria. Colors, font sizes, families, etcetera can be configured through the Theme setting. **SKIP** to the `Variable Tables` section for the full list of variable names and descriptions. Otherwise, below is a breakdown of how variable names are produced.
### `Prefix Table`
 A Prefix is used for all variable names. The prefix helps represents the parent component and is always lowercase.

 ***Game Score** - **Header** - **Controls** - **Board** - **Status***

| Name | Prefix |
|:------------|:--------:|
| Game Score  | `gs` |
| Header | `hd` |
| Controls  | `cs` |
| Board | `bd` |
| Status | `st` |

------------------------
### `Suffix Table`
The suffix is always uppercase and allows accurately styling deep into the component.

| Component | Child Component | Suffix |
|:---------:|:------------:|--------:|
|**Controls** |||
|`cs`| Navigation  | `NV` |
|`cs`| Quick Action| `QA` |
| **Game Score**|||
|`gs`|Score List|`SL`|
|`gs`|Score Title|`ST`|
|`gs`|Shrink Font|`SF`|
|`gs`|Grow Font|`GF`|
|`gs`|Annotation|`AN`|
|`gs`|Ply Count|`PC`|
|`gs`|Variation|`VA`|
|`gs`|White Move|`WM`|
|`gs`|Black Move|`BM`|
|`gs`|Current Annotation|`CA`|
|`gs`|Current Ply Count|`CP`|
|`gs`|Current Variation|`CV`|
|`gs`|Current White Move|`CW`|
|`gs`|Current Black Move|`CB`|
| **Board**|||
|`bd`|Tile|`TL`|
|`bd`|Label|`LB`|
|`bd`|Piece|`PC`|

#### Following the above chart, the *Font Color* property for the **Game Score Annotation** element.

> `gs` + `Font` + `Color` + `AN` = `gsFontColorAN`

#### *Font Size* for the same element

> `gs` + `Font` + `Size` + `AN` = `gsFontSizeAN`

#### *Font Family* for the same element

> `gs` + `Font` + `Family` + `AN` = `gsFontFamilyAN`

Some `Borders` are full border descriptors; `csBorder2NV` is only a color. `Colors` are strings. `Sizes` are numeric values (can contain a fraction - *12.5*) but sizes are always in **pixel** units.

# `Theme Variable Tables`
Below are all Aria Theme variables listed in table format by their parent component and then sub component. When styling Aria, you have access to all of these properties.

## **Board Properties**

### `Chess Pieces`
**TODO:** Add detailed description of chess pieces here

> **NOTE** - The board properties are accessed through `theme.board`.
> 
> To change the light tile color use `theme.board.lightTL`. See the complete property table below.

| Name | Type  | Default | Description |
|:--------------|:-----:|:--------:|:-----------------------|
|**Tiles** |||
|`lightTL`| *color string* | | Sets the light tile color|
|`darkTL`| *color string* | | Sets the dark tile color|
|`lightLB`| *color string* | | Sets the light label color|
|`darkLB`| *color string* | | Sets the dark label color|
|`fontSizeLB`| *color string* | | Sets the light label color|
|`fontFamilyPC`| *color string* | | Sets the font family (directory) used for pieces. See a detailed description of pieces above.
|`typePC`| *color string* | | Sets the image type for parsing and loading pieces (Spritesheet or Split images)
|`extensionPC`| *color string* | | Set the actual format of the data *(SVG or PNG)*. This can also be used to allow other images to be used (desktop vs mobile). See the long explanation on Pieces above. 
## **Control Properties**
| Name | Type  | Default | Description |
|:--------------|:-----:|:--------:|:-----------------------|
|**Navigation Bar** |||
| `csFillNV` | *solid/gradient color* | | Background fill for the navigation bar |
| `csFill2NV` | *solid/gradient color* | | Background fill for the Buttons on the navigation bar |
| `csBorderNV` | *border string* | | Outer border of the navigation bar, describe the border completely - `'2px dashed red'` |
| `csBorder2NV` | *color string* | | The inner border **`color`** for navigation bar buttons - `red` - `#ffac01`|
| `csAccentNV` | *color string* | | The stroke color **`color`** for navigation bar SVG buttons |
|**Quick Action Bar** |||
| `csFillQA` | *solid/gradient color* | |Background fill for the quick action bar |
| `csFill2QA` | *solid/gradient color* | | Background fill for the Buttons on the quick action bar |
| `csBorderQA` | *border string* | | Outer border of the quick action bar, describe the border completely - `'2px solid black'` |
| `csBorder2QA` | *border string* | | The inner border the auto play button - `'2px solid white'`|
| `csAccentQA` | *color string* | | The stroke color **`color`** for quick action bar SVG buttons |
| `csAccent2QA` | *color string* | | The stroke color **`color`** for the auto play timer - *`'transparent'` to hide* |
The Controls element is locked at 100px tall but often times will expand to its full capable width depending on the Layout state.
### **Game Score Properties**
| Name | Type  | Default | Description |
|:-------------|:-----:|:--------:|:-----------------------| 
|**Score List**| | | Score list acts as the base style for the score list (including flow view `result`). |
| `gsFontFamilySL` | *string* | | Sets the Font Family of Game Score Annotation |
| `gsFontSizeSL` | *number* | | Sets the Font Size of Game Score Annotation |
| `gsFontWeightSL` | *color string* | | Sets the background for Annotation |
| `gsFontColorSL` | *color string* | | Sets the Font Color of Game Score Annotation |
| `gsBackgroundSL` | *color string* | | Sets the background for Annotation |
| `gsBorderSL` | *color string* | `solid 2px black` | Sets the border for the Score List |
| `gsMarginSL` | *box description string* | `0px 0px 0px 0px` | Sets the margin (top right bottom left) |
| `gsPaddingSL` | *box description string* | `0px 2px 8px 2px` | Sets the padding |
|**Score Title**| | | Score Title text |
| `gsFontFamilyST` | *string* | | Sets the font family |
| `gsFontSizeST` | *number* | | Sets the font size |
| `gsFontWeightST` | *color string* | | Sets the font weight |
| `gsFontColorST` | *color string* | | Sets the font color |
| `gsBackgroundST` | *color string* | | Sets the background |
| `gsBorderST` | *color string* | `solid 2px black` | Sets the border |
| `gsMarginST` | *box description string* | `0px 0px 0px 0px` | Sets the margin(top right bottom left) |
| `gsPaddingST` | *box description string* | `0px 2px 8px 2px` | Sets the padding for the score list |
|**Shrink Font**| | | Score title shrink font button |
| `gsIconSF` | *string* | | SVG icon name to use (feathericons.com) |
| `gsWidthSF` | *string* | | Sets the width of background/button |
| `gsHeightSF` | *number* | | Sets the height of background/button |
| `gsStrokeWidthSF` | *color string* | | Sets the thickness of the SVG stroke |
| `gsStrokeSF` | *color string* | | Sets the color of the SVG stroke |
| `gsBackgroundSF` | *color string* | | Sets the background |
| `gsBorderSF` | *color string* | `solid 2px black` | Sets the border |
| `gsMarginSF` | *box description string* | `0px 0px 0px 0px` | Sets the margin (top right bottom left) |
| `gsPaddingSF` | *box description string* | `0px 2px 8px 2px` | Sets the padding |
|**Grow Font**| | | Score title grow font button |
| `gsIconGF` | *string* | | SVG icon name to use (feathericons.com) |
| `gsWidthGF` | *string* | | Sets the width of background/button |
| `gsHeightGF` | *number* | | Sets the height of background/button |
| `gsStrokeWidthGF` | *color string* | | Sets the thickness of the SVG stroke |
| `gsStrokeGF` | *color string* | | Sets the color of the SVG stroke |
| `gsBackgroundGF` | *color string* | | Sets the background |
| `gsBorderGF` | *color string* | `solid 2px black` | Sets the border |
| `gsMarginGF` | *box description string* | `0px 0px 0px 0px` | Sets the margin(top right bottom left) |
| `gsPaddingGF` | *box description string* | `0px 2px 8px 2px` | Sets the padding |
| `gsBorderRadiusGF` | *number* | `2 (pixels)` | Sets the border radius |
|**Annotation**||| Annotation styling is applied only to the annotated text|
| `gsFontFamilyAN` | *string* | | Sets the Font Family of Game Score Annotation |
| `gsFontSizeAN` | *number* | | Sets the Font Size of Game Score Annotation |
| `gsFontWeightAN` | *color string* | | Sets the background for Annotation |
| `gsFontColorAN` | *color string* | | Sets the Font Color of Game Score Annotation |
| `gsBackgroundAN` | *color string* | | Sets the background for Annotation |
| `gsBorderAN` | *color string* | | Sets the background for Annotation |
| `gsBorderRadiusAN` | *number* | `2 (pixels)` | Sets the border radius for Annotation |
| `gsMarginAN` | *color string* | `0px 0px 2px 0px` | Sets the margin for Annotation (top right bottom left) |
| `gsPaddingAN` | *color string* | `1px 1px 1px 1px` | Sets the background for Annotation |
|**Ply Count**|| | Ply Count is shown at the beginning of each move (unless disabled)|
| `gsFontFamilyPC` | *string* | `Arial` | Sets the Font Family of Game Score Ply Count |
| `gsFontSizePC` | *number* | `14 (pixels)` | Sets the Font Size of Game Score Ply Count |
| `gsFontWeightPC` | *color string* | `bold` | Sets the background for Ply Count |
| `gsFontColorPC` | *color string* | `black` | Sets the Font Color of Game Score Ply Count |
| `gsBackgroundPC` | *color string* | `transparent` | Sets the background for Ply Count |
| `gsBorderPC` | *border description string* | empty/none | Sets the border for Ply Count |
| `gsBorderRadiusPC` | *number* | `2 (pixels)` | Sets the border radius for Ply Count |
| `gsMarginPC` | *box description string* | `0px 0px 2px 0px` | Sets the margin for Ply Count (top right bottom left) |
| `gsPaddingPC` | *box description string* | `1px 1px 1px 1px` | Sets the padding for Ply Count |
|**Variation**| | | `Styles plys that contain a move variation` |
| `gsFontFamilyVA` | *string* | `FigureFont1` | Sets the font family |
| `gsFontSizeVA` | *number* | `14 (pixels)` | Sets the font size |
| `gsFontWeightVA` | *color string* | empty/none | Sets the font weight |
| `gsFontColorVA` | *color string* | `black` | Sets the font color |
| `gsBackgroundVA` | *color string* | `transparent` | Sets the background|
| `gsBorderVA` | *css border string* | empty/none | Sets the border|
| `gsBorderRadiusVA` | *number* | `2 (pixels)` | Sets the border radius |
| `gsMarginVA` | *box description string* | `0px 0px 2px 0px` | Sets the margin |
| `gsPaddingVA` | *box description string* | `1px 1px 1px 1px` | Sets the padding |
|**White Move**||| `Styles the white move only` |
| `gsFontFamilyWM` | *string* | `FigureFont1` | Sets the font family |
| `gsFontSizeWM` | *number* | `14 (pixels)` | Sets the font size |
| `gsFontWeightWM` | *color string* | empty/none | Sets the font weight |
| `gsFontColorWM` | *color string* | `black` | Sets the font color |
| `gsBackgroundWM` | *color string* | `transparent` | Sets the background|
| `gsBorderWM` | *css border string* | empty/none | Sets the border|
| `gsBorderRadiusWM` | *number* | `2 (pixels)` | Sets the border radius |
| `gsMarginWM` | *box description string* | `0px 0px 2px 0px` | Sets the margin |
| `gsPaddingWM` | *box description string* | `1px 1px 1px 1px` | Sets the padding |
|**Black Move**||| `Styles the black move only` |
| `gsFontFamilyBM` | *string* | `FigureFont1` | Sets the font family |
| `gsFontSizeBM` | *number* | `14 (pixels)` | Sets the font size |
| `gsFontWeightBM` | *color string* | empty/none | Sets the font weight |
| `gsFontColorBM` | *color string* | `black` | Sets the font color |
| `gsBackgroundBM` | *color string* | `transparent` | Sets the background|
| `gsBorderBM` | *css border string* | empty/none | Sets the border|
| `gsBorderRadiusBM` | *number* | `2 (pixels)` | Sets the border radius |
| `gsMarginBM` | *box description string* | `0px 0px 2px 0px` | Sets the margin |
| `gsPaddingBM` | *box description string* | `1px 1px 1px 1px` | Sets the padding |
|**Current Annotation**||
| `gsFontFamilyCA` | *string* | `FigureFont1` | Sets the font family |
| `gsFontSizeCA` | *number* | `14 (pixels)` | Sets the font size |
| `gsFontWeightCA` | *color string* | empty/none | Sets the font weight |
| `gsFontColorCA` | *color string* | `black` | Sets the font color |
| `gsBackgroundCA` | *color string* | `transparent` | Sets the background|
| `gsBorderCA` | *css border string* | empty/none | Sets the border|
| `gsBorderRadiusCA` | *number* | `2 (pixels)` | Sets the border radius |
| `gsMarginCA` | *box description string* | `0px 0px 2px 0px` | Sets the margin |
| `gsPaddingCA` | *box description string* | `1px 1px 1px 1px` | Sets the padding |
|**Current Ply Count**||
| `gsFontFamilyCP` | *string* | `FigureFont1` | Sets the font family |
| `gsFontSizeCP` | *number* | `14 (pixels)` | Sets the font size |
| `gsFontWeightCP` | *color string* | empty/none | Sets the font weight |
| `gsFontColorCP` | *color string* | `black` | Sets the font color |
| `gsBackgroundCP` | *color string* | `transparent` | Sets the background|
| `gsBorderCP` | *css border string* | empty/none | Sets the border|
| `gsBorderRadiusCP` | *number* | `2 (pixels)` | Sets the border radius |
| `gsMarginCP` | *box description string* | `0px 0px 2px 0px` | Sets the margin |
| `gsPaddingCP` | *box description string* | `1px 1px 1px 1px` | Sets the padding |
|**Current Variation**||| `Styling for the current selected move that also has a variation`|
| `gsFontFamilyCV` | *string* | `FigureFont1` | Sets the font family |
| `gsFontSizeCV` | *number* | `14 (pixels)` | Sets the font size |
| `gsFontWeightCV` | *color string* | empty/none | Sets the font weight |
| `gsFontColorCV` | *color string* | `black` | Sets the font color |
| `gsBackgroundCV` | *color string* | `transparent` | Sets the background|
| `gsBorderCV` | *css border string* | empty/none | Sets the border|
| `gsBorderRadiusCV` | *number* | `2 (pixels)` | Sets the border radius |
| `gsMarginCV` | *box description string* | `0px 0px 2px 0px` | Sets the margin |
| `gsPaddingCV` | *box description string* | `1px 1px 1px 1px` | Sets the padding |
|**Current White Move**||| `Styling for the current white Move`|
| `gsFontFamilyCW` | *string* | `FigureFont1` | Sets the font family |
| `gsFontSizeCW` | *number* | `14 (pixels)` | Sets the font size |
| `gsFontWeightCW` | *color string* | empty/none | Sets the font weight |
| `gsFontColorCW` | *color string* | `black` | Sets the font color |
| `gsBackgroundCW` | *color string* | `transparent` | Sets the background|
| `gsBorderCW` | *css border string* | empty/none | Sets the border|
| `gsBorderRadiusCW` | *number* | `2 (pixels)` | Sets the border radius |
| `gsMarginCW` | *box description string* | `0px 0px 2px 0px` | Sets the margin |
| `gsPaddingCW` | *box description string* | `1px 1px 1px 1px` | Sets the padding |
|**Current Black Move**||| `Styling for the current black Move`|
| `gsFontFamilyCB` | *string* | `FigureFont1` | Sets the font family |
| `gsFontSizeCB` | *number* | `14 (pixels)` | Sets the font size |
| `gsFontWeightCB` | *color string* | empty/none | Sets the font weight |
| `gsFontColorCB` | *color string* | `black` | Sets the font color |
| `gsBackgroundCB` | *color string* | `transparent` | Sets the background|
| `gsBorderCB` | *css border string* | empty/none | Sets the border|
| `gsBorderRadiusCB` | *number* | `2 (pixels)` | Sets the border radius |
| `gsMarginCB` | *box description string* | `0px 0px 2px 0px` | Sets the margin |
| `gsPaddingCB` | *box description string* | `1px 1px 1px 1px` | Sets the padding |

More elements and their properties might be added to the theme service over time.
> End of URL Service Definitions

# `2.) By JS Method`
Aria exposes the JS interface through the `window` property `Aria`  *window['Aria']* will get you a reference to the interface. Each service is then fully exposed to the developer. Below the variable `a1` represents the interface to the Aria instance with id `aria`.
```
var a1 = null;
var element = document.getElementById('aria1');
if(iFrame) {
    if(element && element.contentWindow['ARIA']) {
        a1 = element.contentWindow['ARIA'];
    }
}else {
    if(window['ARIA']) {
        a1 = window['ARIA'];
    }
}        
var theme = {boardBGDark:'brown', boardBGLight:'beige'};
a1.theme.setSettings(theme);
a1.aria.loadPGN(TestPGNData);
```
This allows integration with other data fetching methods and asynchronous techniques. Or if desired a custom menu can be used.

Only valid variables names will be used (so check closely). There is no error checking on the value. If you decide to send the game score text color as string `rad` instead of string `red` - you can. It just wont work!😉 Send valid color strings only.





#### Citations for resources used
> Pawn SVG (grow and shrink board) https://www.svgrepo.com/svg/130252/pawn