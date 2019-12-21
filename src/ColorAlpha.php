<?php // phpcs:ignore WordPress.Files.FileName
/**
 * Customize API: ColorAlpha class
 *
 * @package WordPress
 * @subpackage Customize
 * @since 1.0.0
 */

namespace WPTRT\Customize\Control;

use WP_Customize_Color_Control;

/**
 * Customize Color Control class.
 *
 * @since 1.0.0
 *
 * @see WP_Customize_Control
 */
class ColorAlpha extends WP_Customize_Color_Control {

	/**
	 * Type.
	 *
	 * @access public
	 * @since 1.0.0
	 * @var string
	 */
	public $type = 'color-alpha';

	/**
	 * Enqueue scripts/styles for the color picker.
	 *
	 * @access public
	 * @since 1.0.0
	 * @return void
	 */
	public function enqueue() {
		$control_root_url = str_replace(
			wp_normalize_path( untrailingslashit( WP_CONTENT_DIR ) ),
			untrailingslashit( content_url() ),
			dirname( __DIR__ )
		);

		/**
		 * Filters the URL for the scripts.
		 *
		 * @since 1.0.0
		 * @param string $control_root_url The URL to the root folder of the package.
		 * @return string
		 */
		$control_root_url = apply_filters( 'wptrt_color_picker_alpha_url', $control_root_url );

		wp_enqueue_script(
			'wptrt-control-color-picker-alpha',
			$control_root_url . '/dist/main.js',
			// We're including wp-color-picker for localized strings, nothing more.
			[ 'customize-controls', 'wp-element', 'jquery', 'customize-base', 'wp-color-picker' ], // phpcs:ignore Generic.Arrays.DisallowShortArraySyntax
			'1.1',
			true
		);
	}

	/**
	 * Refresh the parameters passed to the JavaScript via JSON.
	 *
	 * @since 3.4.0
	 * @uses WP_Customize_Control::to_json()
	 */
	public function to_json() {
		parent::to_json();
		$this->json['choices'] = $this->choices;
	}

	/**
	 * Empty JS template.
	 *
	 * @access public
	 * @since 1.0.0
	 * @return void
	 */
	public function content_template() {}
}
