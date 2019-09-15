# WPTRT `color-alpha` Control

A color control for the WordPress Customizer with support for alpha channel.

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
		'default'   => '#000000',
		'transport' => 'refresh',
	] );
	$wp_customize->add_control( new ColorAlpha( $wp_customize, 'your_setting_id', [
		'label'      => __( 'My Color', 'mytheme' ),
		'section'    => 'my_section',
		'settings'   => 'your_setting_id',
	] ) );
} );
```

Depending on where the files for this package are in your theme, you may need to add a filter so that the control assets get properly loaded. The default location for the package is the `vendor/wptrt/control-color-alpha` folder in your theme. If you are not using composer to load this package - or if you are using a custom folder-name instead of `vendor` for your packages, you can use the `wptrt_color_picker_alpha_url` filter:

```php
add_filter( 'wptrt_color_picker_alpha_url', function() {
    return get_template_directory_uri() . '/my-custom-folder/control-color-alpha';
});
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
