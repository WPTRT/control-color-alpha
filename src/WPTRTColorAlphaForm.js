/* globals _, wp, React */
import ChromePicker from 'react-color';
import reactCSS from 'reactcss';

const WPTRTColorAlphaForm = ( props ) => {

	/**
	 * Get the CSS value of the selected color.
	 *
	 * @param {Object} color - The color object from react-color.
	 * @return {string}
	 */
	const getCSSColor = ( color ) => {
		if ( 'string' === typeof color ) {
			return color;
		}
		if ( color.css ) {
			return color.css;
		}
		if ( color.rgb && color.rgb.a && 1 > color.rgb.a ) {
			return 'rgba(' + color.rgb.r + ',' + color.rgb.g + ',' + color.rgb.b + ',' + color.rgb.a + ')';
		}
		if ( color.hex ) {
			return color.hex;
		}
		return color;
	}

	/**
	 * Properly format the value to be saved depending on our options.
	 *
	 * @param {string} value
	 * @return {string|Object}
	 */
	const formatValue = ( value ) => {
		const saveArray = ( 'array' === props.choices.save_as );
		let color, white, black, finalValue;

		if ( saveArray ) {
			color = Color( value );
			white = Color( '#ffffff' );
			black = Color( '#000000' );

			// Get the basics for this color.
			finalValue = {
				r: color.r(),
				g: color.g(),
				b: color.b(),
				h: color.h(),
				s: color.s(),
				l: color.l(),
				a: color.a(),
				v: color.toHsl().v
			};

			finalValue.hex = 1 === finalValue.a ? color.toCSS() : color.clone().a( 1 ).toCSS();
			finalValue.css = 1 === finalValue.a ? finalValue.hex : 'rgba(' + finalValue.r + ',' + finalValue.g + ',' + finalValue.b + ',' + finalValue.a + ')';

			// A11y properties.
			finalValue.a11y = {
				luminance: color.toLuminosity(),
				distanceFromWhite: color.getDistanceLuminosityFrom( white ),
				distanceFromBlack: color.getDistanceLuminosityFrom( black ),
				maxContrastColor: color.clone().a( 1 ).getMaxContrastColor().toCSS(),
				readableContrastingColorFromWhite: [
					color.clone().a( 1 ).getReadableContrastingColor( white, 7 ).toCSS(),
					color.clone().a( 1 ).getReadableContrastingColor( white, 4.5 ).toCSS()
				],
				readableContrastingColorFromBlack: [
					color.clone().a( 1 ).getReadableContrastingColor( black, 7 ).toCSS(),
					color.clone().a( 1 ).getReadableContrastingColor( black, 4.5 ).toCSS()
				]
			};
			finalValue.a11y.isDark = finalValue.a11y.distanceFromWhite > finalValue.a11y.distanceFromBlack;

			return finalValue;
		}

		return value;
	};

	/**
	 * Save the value when changing the colorpicker.
	 *
	 * @param {Object} color - The color object from react-color.
	 * @return {void}
	 */
	const handleChangeComplete = ( color ) => {
		wp.customize.control( props.customizerSetting.id ).setting.set( formatValue( getCSSColor( color ) ) );
	};

	/**
	 * Save the value when changing the text input.
	 *
	 * @param {Object} e - The change event.
	 * @return {void}
	 */
	const handleInputChange = ( e ) => {
		wp.customize.control( props.customizerSetting.id ).setting.set( formatValue( e.target.value ) );
	};

	/**
	 * Reset value to its default.
	 *
	 * @param {Object} e - The click event.
	 * @return {void}
	 */
	const resetValue = ( e ) => {
		e.preventDefault();
		let defaultValue = ( props.defaultValue ) ? props.defaultValue : '';
		if ( 'string' === typeof defaultValue ) {
			defaultValue = formatValue( defaultValue );
		}
		wp.customize.control( props.customizerSetting.id ).setting.set( defaultValue );
	}

	const styles = reactCSS({
		'default': {
			textInput: {
				fontFamily: 'Menlo, Consolas, monaco, monospace',
				borderRadius: '0 4px 4px 0',
				width: '100%'
			},

			colorIndicator: {
				background: props.value.css ? props.value.css : props.value,
				display: 'block',
				width: '40px',
				borderRadius: '4px 0 0 4px'
			},

			inputWrapper: {
				display: 'flex',
				marginBottom: '12px',
			},

			resetButton: {
			}
		}
	});

	return (
		<div>
			<label className="customize-control-title" for={ props.control.id + '-input' }>{ props.label }</label>
			<span className="description customize-control-description" dangerouslySetInnerHTML={{ __html: props.description }}></span>
			<div className="customize-control-notifications-container" ref={ props.setNotificationContainer }></div>
			<div style={ styles.inputWrapper }>
				<span style={ styles.colorIndicator }></span>
				<input
					type="text"
					style={ styles.textInput }
					value={ 'array' === props.choices.save_as ? props.value.css : props.value }
					onChange={ handleInputChange }
					id={ props.control.id + '-input' }
				/>
				<button className="button" onClick={ resetValue } style={ styles.resetButton }>{ window.wpColorPickerL10n.defaultString }</button>
			</div>
			<ChromePicker
				width="300"
				{ ...props.choices }
				color={ 'array' === props.choices.save_as ? props.value.css : props.value }
				onChangeComplete={ handleChangeComplete }
			/>
		</div>
	);
};

export default WPTRTColorAlphaForm;
