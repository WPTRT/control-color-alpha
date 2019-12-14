/* global wp, jQuery, React, ReactDOM, Color */
import WPTRTColorAlphaForm from './WPTRTColorAlphaForm';

/**
 * WPTRTColorAlphaControl.
 *
 * @class
 * @augments wp.customize.Control
 * @augments wp.customize.Class
 */
const WPTRTColorAlphaControl = wp.customize.Control.extend({

	/**
	 * After control has been first rendered, start re-rendering when setting changes.
	 *
	 * React is able to be used here instead of the wp.customize.Element abstraction.
	 *
	 * @returns {void}
	 */
	ready: function ready() {
		const control = this;

		// Re-render control when setting changes.
		control.setting.bind( () => {
			control.renderContent();
		} );
	},

	/**
	 * Embed the control in the document.
	 *
	 * Overrides the embed() method to embed the control
	 * when the section is expanded instead of on load.
	 *
	 * @since 1.0.0
	 * @return {void}
	 */
	embed: function() {
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
	actuallyEmbed: function() {
		const control = this;
		if ( 'resolved' === control.deferred.embedded.state() ) {
			return;
		}
		control.renderContent();
		control.deferred.embedded.resolve(); // Triggers control.ready().
	},

	/**
	 * Initialize.
	 *
	 * @param {string} id - Control ID.
	 * @param {object} params - Control params.
	 */
	initialize: function( id, params ) {
		const control = this;

		// Bind functions to this control context for passing as React props.
		control.setNotificationContainer = control.setNotificationContainer.bind( control );

		wp.customize.Control.prototype.initialize.call( control, id, params );

		// The following should be eliminated with <https://core.trac.wordpress.org/ticket/31334>.
		function onRemoved( removedControl ) {
			if ( control === removedControl ) {
				control.destroy();
				control.container.remove();
				wp.customize.control.unbind( 'removed', onRemoved );
			}
		}
		wp.customize.control.bind( 'removed', onRemoved );
	},

	/**
	 * Set notification container and render.
	 *
	 * This is called when the React component is mounted.
	 *
	 * @param {Element} element - Notification container.
	 * @returns {void}
	 */
	setNotificationContainer: function setNotificationContainer( element ) {
		const control = this;
		control.notifications.container = jQuery( element );
		control.notifications.render();
	},

	/**
	 * Render the control into the DOM.
	 *
	 * This is called from the Control#embed() method in the parent class.
	 *
	 * @returns {void}
	 */
	renderContent: function renderContent() {
		const control = this;
		const value = control.setting.get();

		const form = <WPTRTColorAlphaForm
			{ ...control.params }
			value={ value }
			setNotificationContainer={ control.setNotificationContainer }
			customizerSetting={ control.setting }
			control={ control }
			choices={ control.params.choices }
		/>;
		ReactDOM.render(
			form,
			control.container[0]
		);

		if ( false !== control.params.choices.allowCollapse ) {
			control.container.addClass( 'allowCollapse colorPickerIsCollapsed' );
		}
	},

	/**
	 * Handle removal/de-registration of the control.
	 *
	 * This is essentially the inverse of the Control#embed() method.
	 *
	 * @link https://core.trac.wordpress.org/ticket/31334
	 * @returns {void}
	 */
	destroy: function destroy() {
		const control = this;

		// Garbage collection: undo mounting that was done in the embed/renderContent method.
		ReactDOM.unmountComponentAtNode( control.container[0] );

		// Call destroy method in parent if it exists (as of #31334).
		if ( wp.customize.Control.prototype.destroy ) {
			wp.customize.Control.prototype.destroy.call( control );
		}
	}
});

export default WPTRTColorAlphaControl;
