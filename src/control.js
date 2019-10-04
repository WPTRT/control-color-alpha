/**
 * A colorpicker control.
 *
 * @since 1.0.0
 * @augments wp.customize.ColorControl
 */
wp.customize.controlConstructor['color-alpha'] = wp.customize.ColorControl.extend({
	/**
	 * Embed the control in the document.
	 *
	 * Overrides the embed() method to embed the control
	 * when the section is expanded instead of on load.
	 *
	 * @since 1.0.0
	 * @return {void}
	 */
	embed: function () {
		const control = this;
		const sectionId = control.section();
		if ( ! sectionId ) {
			return;
		}
		wp.customize.section( sectionId, function( section ) {
			section.expanded.bind( function( expanded ) {
				if ( expanded ) {
					control.actuallyEmbed();
				}
			} );
		} );
	},

	/**
	 * Deferred embedding of control.
	 *
	 * This function is called in Section.onChangeExpanded() so the control
	 * will only get embedded when the Section is first expanded.
	 *
	 * @since 1.0.0
	 */
	actuallyEmbed: function () {
		const control = this;
		if ( 'resolved' === control.deferred.embedded.state() ) {
			return;
		}
		control.renderContent();
		control.deferred.embedded.resolve(); // Triggers control.ready().
	},
} );
