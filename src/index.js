/* global wp */

import WPTRTColorAlphaControl from './WPTRTColorAlphaControl';

// Register control type with Customizer.
wp.customize.controlConstructor['color-alpha'] = WPTRTColorAlphaControl;
