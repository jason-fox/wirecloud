/*
 *     Copyright (c) 2008-2016 CoNWeT Lab., Universidad Politécnica de Madrid
 *     Copyright (c) 2020 Future Internet Consulting and Development Solutions S.L.
 *
 *     This file is part of Wirecloud Platform.
 *
 *     Wirecloud Platform is free software: you can redistribute it and/or
 *     modify it under the terms of the GNU Affero General Public License as
 *     published by the Free Software Foundation, either version 3 of the
 *     License, or (at your option) any later version.
 *
 *     Wirecloud is distributed in the hope that it will be useful, but WITHOUT
 *     ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 *     FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public
 *     License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with Wirecloud Platform.  If not, see
 *     <http://www.gnu.org/licenses/>.
 *
 */

/* globals StyledElements */


(function (se, utils) {

    "use strict";

    se.RadioButton = class RadioButton extends se.InputElement {

        constructor(options) {
            const defaultOptions = {
                'initiallyChecked': false,
                'class': '',
                'group': null,
                'value': null
            };
            options = utils.merge(defaultOptions, options);

            super(options.initiallyChecked, ['change']);

            this.wrapperElement = document.createElement("input");

            this.wrapperElement.setAttribute("type", "radio");
            if (options.value != null) {
                this.wrapperElement.setAttribute("value", options.value);
            }
            this.inputElement = this.wrapperElement;

            if (options.name != null) {
                this.inputElement.setAttribute("name", options.name);
            }

            if (options.id != null) {
                this.wrapperElement.setAttribute("id", options.id);
            }

            if (options.initiallyChecked === true) {
                this.inputElement.setAttribute("checked", true);
            }

            if (options.group instanceof StyledElements.ButtonsGroup) {
                this.wrapperElement.setAttribute("name", options.group.name);
                options.group.insertButton(this);
            } else if (typeof options.group === 'string') {
                this.wrapperElement.setAttribute("name", options.group);
            }

            /* Internal events */
            this.inputElement.addEventListener('mousedown', utils.stopPropagationListener, true);
            this.inputElement.addEventListener('click', utils.stopPropagationListener, true);
            this.inputElement.addEventListener(
                'change',
                () => {
                    if (this.enabled) {
                        this.dispatchEvent('change');
                    }
                },
                true
            );
        }

        insertInto(element, refElement) {
            const checked = this.inputElement.checked; // Necesario para IE
            StyledElements.StyledElement.prototype.insertInto.call(this, element, refElement);
            this.inputElement.checked = checked; // Necesario para IE
        }

        reset() {
            this.inputElement.checked = this.defaultValue;

            return this;
        }

        setValue(newValue) {
            this.inputElement.checked = newValue;

            return this;
        }

    }

})(StyledElements, StyledElements.Utils);
