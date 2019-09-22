# WPTRT `color-alpha` Control

A color control for the WordPress Customizer with support for alpha channel.

The control will save either a HEX value (`#000000`) or RGBA (`rgba(0,0,0,0.9)`) depending on the opacity of the selected color. If the color is completely opaque, then it will save a HEX value. If the selected color is not completely opaque (has an alpha value smaller than 1) then the value will be saved as RGBA.

## Usage

### Registering the Control

This is a control containing a JS template. As such, it should be whitelisted in the Customizer. To do that we can use the [`WP_Customize_Manager::register_control_type`](https://developer.wordpress.org/reference/classes/wp_customize_manager/register_control_type/) method:

```php
add_action( 'customize_register', function( $wp_customize ) {
	$wp_customize->register_control_type( '\WPTRT\Customize\Control\ColorAlpha' );
} );
```

After we register the control using the above code, we can use it in the customizer using the [Customizer API](https://developer.wordpress.org/themes/customize-api/customizer-objects/):


```php
use \WPTRT\Customize\Control\ColorAlpha;

add_action( 'customize_register', function( $wp_customize ) {

	$wp_customize->add_setting( 'your_setting_id' , [
		'default'           => 'rgba(0,0,0,0.5)', // Use any HEX or RGBA value.
		'transport'         => 'refresh',
		'sanitize_callback' => 'my_custom_sanitization_callback'
	] );
	$wp_customize->add_control( new ColorAlpha( $wp_customize, 'your_setting_id', [
		'label'      => __( 'My Color', 'mytheme' ),
		'section'    => 'my_section',
		'settings'   => 'your_setting_id',
	] ) );
} );
```

## Available filters

### `wptrt_color_picker_alpha_url`

You can use this filter to change the URL for control assets. By default the control will work out of the box for any plugins and themes installed in `wp-content/themes` and `wp-content/plugins` respectively. It is possible however to change the URL by using the `wptrt_color_picker_alpha_url` filter:

```php
add_filter( 'wptrt_color_picker_alpha_url', function() {
    return get_template_directory_uri() . '/vendor/wptrt/control-color-alpha/src';
} );
```

## Sanitization

All controls in the WordPress Customizer should have a sanitize_callback defined.
You can write your own function and use it as a sanitization callback, or use the example function below:

```php
/**
 * Sanitize colors.
 *
 * @static
 * @access public
 * @since 1.0.2
 * @param string $value The color.
 * @return string
 */
function my_custom_sanitization_callback( $value ) {
	// This pattern will check and match 3/6/8-character hex, rgb, rgba, hsl, & hsla colors.
	$pattern = '/^(\#[\da-f]{3}|\#[\da-f]{6}|\#[\da-f]{8}|rgba\(((\d{1,2}|1\d\d|2([0-4]\d|5[0-5]))\s*,\s*){2}((\d{1,2}|1\d\d|2([0-4]\d|5[0-5]))\s*)(,\s*(0\.\d+|1))\)|hsla\(\s*((\d{1,2}|[1-2]\d{2}|3([0-5]\d|60)))\s*,\s*((\d{1,2}|100)\s*%)\s*,\s*((\d{1,2}|100)\s*%)(,\s*(0\.\d+|1))\)|rgb\(((\d{1,2}|1\d\d|2([0-4]\d|5[0-5]))\s*,\s*){2}((\d{1,2}|1\d\d|2([0-4]\d|5[0-5]))\s*)|hsl\(\s*((\d{1,2}|[1-2]\d{2}|3([0-5]\d|60)))\s*,\s*((\d{1,2}|100)\s*%)\s*,\s*((\d{1,2}|100)\s*%)\))$/';
	\preg_match( $pattern, $value, $matches );
	// Return the 1st match found.
	if ( isset( $matches[0] ) ) {
		if ( is_string( $matches[0] ) ) {
			return $matches[0];
		}
		if ( is_array( $matches[0] ) && isset( $matches[0][0] ) ) {
			return $matches[0][0];
		}
	}
	// If no match was found, return an empty string.
	return '';
}
```

## Autoloading

You'll need to use an autoloader with this. Ideally, this would be [Composer](https://getcomposer.org).  However, we have a [basic autoloader](https://github.com/WPTRT/autoload) available to include with themes if needed.

### Composer

From the command line:

```sh
composer require wptrt/control-color-alpha
```

### WPTRT Autoloader

If using the WPTRT autoloader, use the following code:

```php
include get_theme_file_path( 'path/to/autoload/src/Loader.php' );

$loader = new \WPTRT\Autoload\Loader();
$loader->add( 'WPTRT\\Customize\\Control', get_theme_file_path( 'path/to/control-color-alpha/src' ) );
$loader->register();
```
