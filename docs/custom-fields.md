# Content Constructor Custom Fields

It is possible to add custom fields to the Content Constructor components **per project** to all Content Constructor components. This feature allows adding new configuration fields, which can be saved in Component configuration and read later within the templates to develop custom functionalities.

There are many types of fields that are supported. They will be listed and described in detail at the end of this document.

## How to introduce custom fields

The mechanism relies on adding new configurator fields by extending view.xml variables for MageSuite_ContentConstructor module in the project **theme**.

There are two places, for which, custom fields can be added:

-   Image Teaser Slide Configurator - a place where we configure a specific image within the Image Teaser
    
-   Component Configurator - general configurator of the component
    

The rest happens under the hood of content constructor module.

The easiest way to see it in action is to try yourself, just use the below examples to add custom fields,

and use configurations of their types form **the table**

## Adding custom field to Component Configurator

**Example Task:** My designs say that the image teaser component can have either white (default), grey or black background. A client wants to decide on that while configuring component.

```
// theme-example/src/etc/view.xml

<vars module="MageSuite_ContentConstructor">
    <var name="image_teaser">
        <var name="custom_sections">
            <var name="0">
                <var name="label">Advanced</var>
                <var name="content">
                    <var name="fields">
                        <var name="0">
                            <var name="label">Component's background color</var>
                            <var name="type">select</var>
                            <var name="model">background</var>
                            <var name="options">
                                <var name="cs-image-teaser--bg-white">White</var>
                                <var name="cs-image-teaser--bg-grey">Grey</var>
                                <var name="cs-image-teaser--bg-black">Black</var>
                            </var>
							<var name="default">cs-image-teaser--bg-white</var>
							<var name="frontend_type">css_class</var>
						</var>
					</var>
				</var>
			</var>
		</var>
	</var>
</vars>
```

## Adding a custom field to the Image Teaser slide configurator

**Example task:** Client needs to display price of the product, he puts into image teaser and additionally he wants to select its position among 9 predefined, exactly the way text content is positioned.

For this purpose 2 custom fields will be added to Image Teaser slide configurator:

```
<vars module="MageSuite_ContentConstructor">
    <var name="teaser">
        <var name="tabs">
            <var name="2">
                <var name="label">badge</var>
                <var name="content">
                    <var name="fields">
                        <var name="0">
                            <var name="label">Badge text</var>
                            <var name="type">textarea</var>
                            <var name="model">badge_text</var>
                            <var name="hint"><![CDATA[
                                Add content with special markup, e.g.:<br>
                                - <small>Only</small> {{price sku="some_sku"}}<br>
                                - {{sku sku="some_sku"}}<br>
                                - <big>Only</big> {{qty sku="some_sku"}} left
                            ]]></var>
                        </var>
                        <var name="1">
                            <var name="label">Badge align</var>
                            <var name="type">position</var>
                            <var name="model">badge_align</var>
                            <var name="rows">3</var>
                            <var name="columns">3</var>
                            <var name="default">
                                <var name="x">1</var>
                                <var name="y">1</var>
                            </var>
                            <var name="warning">Note: Please verify text position configuration in the "Content" tab. It might overlap the badge position.</var>
                        </var>
                    </var>
                </var>
            </var>
        </var>
    </var>
</vars>
```

## Types of custom fields

This section contains all types of fields, that can be used as custom fields:

### input

```
...
	<var name="fields">
        <var name="1">
            <var name="label">Text input</var>
            <var name="type">input</var>
            <var name="model">input_sample</var>
            <var name="hint">Hey, this is example of "hint"</var>
            <var name="default">Default input value</var>
            <var name="frontend_type">css_class</var>
        </var>
   </var>
   ...
...
```

### select

Select field. Dedicated for limited options, like pre-defined CSS classes or icons.
Value of **default** has to cover one of defined options

```
...
	<var name="fields">
        <var name="1">
            <var name="label">Teaser background</var>
            <var name="type">select</var>
            <var name="model">select_sample</var>
            <var name="note">Hey, this is example of "note"</var>
			<var name="options">
                <var name="cs-image-teaser__slide--grey"></var>
                <var name="cs-image-teaser__slide--black">Black</var>
                <var name="cs-image-teaser__slide--white">White</var>
			</var>
            <var name="default">cs-image-teaser__slide--white</var>
            <var name="frontend_type">css_class</var>
        </var>
   </var>
   ...
...
```

### textarea

Textarea for more complex content. Remember to not provide too much of it as frontend might have problems to fit all of it.
You can use directives.

```
...
	<var name="fields">
        <var name="1">
            <var name="label">Badge text</var>
            <var name="type">textarea</var>
            <var name="model">badge_text</var>
            <var name="hint"><![CDATA[
            	Add content with special markup, e.g.:<br>
                - <small>Only</small> {{price sku="some_sku"}}<br>
                - {{sku sku="some_sku"}}<br>
                - <big>Only</big> {{qty sku="some_sku"}} left
            ]]></var>
        </var>
   </var>
   ...
...
```


### position

Position grid feature known from Content Align feature to set position of text for single teaser

```
...
	<var name="fields">
        <var name="1">
            <var name="label">Badge align</var>
            <var name="type">position</var>
            <var name="model">badge_align</var>
            <var name="rows">3</var>
            <var name="columns">3</var>
            <var name="default">
                <var name="x">1</var>
                <var name="y">1</var>
            </var>
            <var name="warning">Note: Please verify text position
 				configuration in the "Content" tab. It 
				might overlap the badge position.</var>
            <var name="frontend_type">html</var>
        </var>
   </var>
   ...
...
```

### checkbox

Checkbox styled magento way (switcher-alike). Use it if you need boolean value on the frontend 

```
...
	<var name="fields">
        <var name="1">
            <var name="label">Make logo bigger</var>
            <var name="type">checkbox</var>
            <var name="model">checkbox_sample</var>
            <var name="checked">true</var>
            <var name="frontend_type">html</var>
        </var>
   </var>
   ...
...
```

### radio

Standard options list.

```
...
	<var name="fields">
        <var name="1">
            <var name="label">Radio list</var>
            <var name="type">radio</var>
            <var name="model">radio_sample</var>
            <var name="options">
                <var name="option_1">Option #1</var>
                <var name="option_2">Option #2</var>
                <var name="option_3">Option #3</var>
            </var>
            <var name="default">option_2</var>
        </var>
   </var>
   ...
...
```

### color

Color picker

```
...
	<var name="fields">    
		<var name="1">
        	<var name="label">Text color</var>
        	<var name="type">color</var>
        	<var name="model">text_color</var>
        	<var name="default">#50505A</var>
    	</var>
	</var>
	...
...
```

### datetime-range

Fieldset consisting of two datetime-local inputs (native datetime pickers)

```
...
	<var name="fields">    
		<var name="1">
        	<var name="label">Datetime</var>
        	<var name="type">datetime-range</var>
        	<var name="model">custom_date_range</var>
    	</var>
	</var>
	...
...
```