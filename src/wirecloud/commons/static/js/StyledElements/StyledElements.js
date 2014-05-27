/*---------------------------------------------------------------------------*
 *                               StyledElements                              *
 *---------------------------------------------------------------------------*/

/**
 * @abstract
 */
StyledElements.StyledElement = function(events) {
    StyledElements.ObjectWithEvents.call(this, events);
    this.wrapperElement = null;
    this.enabled = true;
}
StyledElements.StyledElement.prototype = new StyledElements.ObjectWithEvents();

/**
 * Inserta el elemento con estilo dentro del elemento indicado.
 *
 * @param element Este será el elemento donde se insertará el elemento con
 * estilo.
 * @param refElement Este parámetro es opcional. En caso de ser usado, sirve
 * para indicar delante de que elemento se tiene que añadir este elemento con
 * estilo.
 */
StyledElements.StyledElement.prototype.insertInto = function (element, refElement) {
    if (element instanceof StyledElements.StyledElement) {
        element = element.wrapperElement;
    }

    if (refElement instanceof StyledElements.StyledElement) {
        refElement = refElement.wrapperElement;
    }

    if (refElement)
        element.insertBefore(this.wrapperElement, refElement);
    else
        element.appendChild(this.wrapperElement);
}

/**
 * @private
 */
StyledElements.StyledElement.prototype._getUsableHeight = function() {
    var parentElement = this.wrapperElement.parentNode;
    if (!Wirecloud.Utils.XML.isElement(parentElement)) {
        return null;
    }

    var parentStyle = document.defaultView.getComputedStyle(parentElement, null);
    if (parentStyle.getPropertyCSSValue('display') == null) {
        return null;
    }
    var containerStyle = document.defaultView.getComputedStyle(this.wrapperElement, null);

    var height = parentElement.offsetHeight -
                 parentStyle.getPropertyCSSValue('padding-top').getFloatValue(CSSPrimitiveValue.CSS_PX) -
                 parentStyle.getPropertyCSSValue('padding-bottom').getFloatValue(CSSPrimitiveValue.CSS_PX) -
                 containerStyle.getPropertyCSSValue('padding-top').getFloatValue(CSSPrimitiveValue.CSS_PX) -
                 containerStyle.getPropertyCSSValue('padding-bottom').getFloatValue(CSSPrimitiveValue.CSS_PX) -
                 containerStyle.getPropertyCSSValue('border-top-width').getFloatValue(CSSPrimitiveValue.CSS_PX) -
                 containerStyle.getPropertyCSSValue('border-bottom-width').getFloatValue(CSSPrimitiveValue.CSS_PX) -
                 containerStyle.getPropertyCSSValue('margin-top').getFloatValue(CSSPrimitiveValue.CSS_PX) -
                 containerStyle.getPropertyCSSValue('margin-bottom').getFloatValue(CSSPrimitiveValue.CSS_PX);

    return height;
}

/**
 * @private
 */
StyledElements.StyledElement.prototype._getUsableWidth = function() {
    var parentElement = this.wrapperElement.parentNode;
    if (!Wirecloud.Utils.XML.isElement(parentElement))
        return null;

    var parentStyle = document.defaultView.getComputedStyle(parentElement, null);
    var containerStyle = document.defaultView.getComputedStyle(this.wrapperElement, null);

    var width = parentElement.offsetWidth -
                parentStyle.getPropertyCSSValue('padding-left').getFloatValue(CSSPrimitiveValue.CSS_PX) -
                parentStyle.getPropertyCSSValue('padding-right').getFloatValue(CSSPrimitiveValue.CSS_PX) -
                containerStyle.getPropertyCSSValue('padding-left').getFloatValue(CSSPrimitiveValue.CSS_PX) -
                containerStyle.getPropertyCSSValue('padding-right').getFloatValue(CSSPrimitiveValue.CSS_PX);

    return width;
}

/**
 * Esta función sirve para repintar el componente.
 *
 * @param {Boolean} temporal Indica si se quiere repintar el componente de
 * forma temporal o de forma permanente. Por ejemplo, cuando mientras se está
 * moviendo el tirador de un HPaned se llama a esta función con el parámetro
 * temporal a <code>true</code>, permitiendo que los componentes intenten hacer
 * un repintado más rápido (mejorando la experiencia del usuario); y cuando el
 * usuario suelta el botón del ratón se ejecuta una última vez esta función con
 * el parámetro temporal a <code>false</code>, indicando que el usuario ha
 * terminado de mover el tirador y que se puede llevar a cabo un repintado más
 * inteligente. Valor por defecto: <code>false</code>.
 */
StyledElements.StyledElement.prototype.repaint = function (temporal) {
}

/**
 *
 */
StyledElements.StyledElement.prototype.hasClassName = function(className) {
    return this.wrapperElement.classList.contains(className);
}

/**
 *
 */
StyledElements.StyledElement.prototype.addClassName = function(className) {
    var i, tokens;

    className = className.trim();
    if (className === '') {
        return;
    }

    tokens = className.split(/\s+/);
    for (i = 0; i < tokens.length; i++) {
        this.wrapperElement.classList.add(tokens[i]);
    }
};

/**
 *
 */
StyledElements.StyledElement.prototype.removeClassName = function(className) {
    var i, tokens;

    className = className.trim();
    if (className === '') {
        return;
    }

    tokens = className.split(/\s+/);
    for (i = 0; i < tokens.length; i++) {
        this.wrapperElement.classList.remove(tokens[i]);
    }
};

StyledElements.StyledElement.prototype.setDisabled = function(disable) {
    if (disable) {
        this.disable();
    } else {
        this.enable();
    }
}

/**
 * Rehabilita el componente quitándole la clase css .disabled
 */
StyledElements.StyledElement.prototype.enable = function() {
    this.enabled = true;
    this.removeClassName('disabled');
}

/**
 * Deshabilita el componente añadiendo la clase css .disabled
 */
StyledElements.StyledElement.prototype.disable = function() {
    this.enabled = false;
    this.addClassName('disabled');
}

/*
 * @experimental
 */
StyledElements.StyledElement.prototype.getBoundingClientRect = function () {
    return this.wrapperElement.getBoundingClientRect();
};

/**
 * @abstract
 *
 * Esta clase contiene la lógica base de todos los elementos StyledElements que
 * corresponden con un elemento de entrada de datos valido tanto para usarlos
 * junto con formularios como sin ellos.
 */
StyledElements.StyledInputElement = function(defaultValue, events) {
    this.inputElement = null;
    this.defaultValue = defaultValue;

    StyledElements.StyledElement.call(this, events);
}
StyledElements.StyledInputElement.prototype = new StyledElements.StyledElement();

StyledElements.StyledInputElement.prototype.getValue = function () {
    return this.inputElement.value;
}

StyledElements.StyledInputElement.prototype.setValue = function (newValue) {
    this.inputElement.value = newValue;
}

StyledElements.StyledInputElement.prototype.reset = function () {
    this.setValue(this.defaultValue);
}

StyledElements.StyledInputElement.prototype.enable = function() {
    StyledElements.StyledElement.prototype.enable.call(this);
    this.inputElement.disabled = false;
}

StyledElements.StyledInputElement.prototype.disable = function() {
    StyledElements.StyledElement.prototype.disable.call(this);
    this.inputElement.disabled = true;
}

StyledElements.StyledInputElement.prototype.focus = function() {
    this.inputElement.focus();
}

/**
 * Este componente permite crear un contenedor en el que añadir otros
 * componentes.
 *
 * @param options
 * @param events
 */
StyledElements.Container = function(options, events) {
    var defaultOptions = {
        'extending': false,
        'class': '',
        'useFullHeight': false
    };
    options = Wirecloud.Utils.merge(defaultOptions, options);

    // Necesario para permitir herencia
    if (options.extending)
        return;

    StyledElements.StyledElement.call(this, events);

    this.useFullHeight = options.useFullHeight;
    this.wrapperElement = document.createElement("div");
    this.childs = new Array();

    if (options['id']) {
        this.wrapperElement.setAttribute("id", options['id']);
    }

    this.wrapperElement.className = Wirecloud.Utils.prependWord(options['class'], "container");
}
StyledElements.Container.prototype = new StyledElements.StyledElement();

StyledElements.Container.prototype.appendChild = function(element) {
    if (element instanceof StyledElements.Fragment) {
        element.insertInto(this);
    } else if (element instanceof StyledElements.StyledElement) {
        element.insertInto(this);
        this.childs.push(element);
    } else {
        this.wrapperElement.appendChild(element);
    }
}

StyledElements.Container.prototype.removeChild = function(element) {
    var index;
    if (element instanceof StyledElements.StyledElement) {
        index = this.childs.indexOf(element);
        this.childs.splice(index, 1);
        this.wrapperElement.removeChild(element.wrapperElement);
    } else {
        this.wrapperElement.removeChild(element);
    }
}

StyledElements.Container.prototype.repaint = function(temporal) {
    temporal = temporal !== undefined ? temporal : false;

    if (this.useFullHeight) {
        if (this.wrapperElement.classList.contains('hidden')) {
            this.wrapperElement.style.height = "";
            return;
        }

        var height = this._getUsableHeight();
        if (height == null) {
            return; // nothing to do
        }

        this.wrapperElement.style.height = (height + "px");
    }

    for (var i = 0; i < this.childs.length; i++)
        this.childs[i].repaint(temporal);

    if (this.disabledLayer != null) {
        this.disabledLayer.style.height = this.wrapperElement.scrollHeight + 'px';
        this.disabledLayer.style.lineHeight = this.wrapperElement.clientHeight + 'px';
    }
}

/**
 * Elimina el contenido de este contenedor.
 */
StyledElements.Container.prototype.clear = function() {
    this.childs = new Array();
    this.wrapperElement.innerHTML = "";
    if (this.disabledLayer != null) {
        this.wrapperElement.appendChild(this.disabledLayer);
    }
}

/**
 * Devuelve <code>true</code> si este Componente está deshabilitado.
 */
StyledElements.Container.prototype.isDisabled = function() {
    return this.disabledLayer != null;
}

/**
 * Deshabilita/habilita este contenedor. Cuando un contenedor
 */
StyledElements.Container.prototype.setDisabled = function(disabled) {
    if (this.isDisabled() == disabled) {
      // Nothing to do
      return;
    }

    if (disabled) {
        this.disabledLayer = document.createElement('div');
        this.disabledLayer.className = 'disable-layer';

        this.disabled_icon = document.createElement('i');
        this.disabled_icon.className = 'disable-icon icon-spin icon-spinner';
        this.disabledLayer.appendChild(this.disabled_icon);

        this.wrapperElement.appendChild(this.disabledLayer);
        this.wrapperElement.classList.add('disabled');
        this.disabledLayer.style.height = this.wrapperElement.scrollHeight + 'px';
        this.disabledLayer.style.lineHeight = this.wrapperElement.clientHeight + 'px';
    } else {
        this.wrapperElement.classList.remove('disabled');
        this.disabledLayer.parentNode.removeChild(this.disabledLayer);
        this.disabledLayer = null;
        this.disable_icon = null;
    }
    this.enabled = !disabled;
}

StyledElements.Container.prototype.enable = function() {
    this.setDisabled(false);
}

StyledElements.Container.prototype.disable = function() {
    this.setDisabled(true);
}

/**
 *
 */
StyledElements.StyledHiddenField = function(options) {
    var defaultOptions = {
        'initialValue': '',
        'class': ''
    };
    options = Wirecloud.Utils.merge(defaultOptions, options);

    StyledElements.StyledInputElement.call(this, options.initialValue, []);

    this.wrapperElement = document.createElement("div");

    this.wrapperElement.className = Wirecloud.Utils.prependWord(options['class'], 'styled_hidden_field');

    this.inputElement = document.createElement("input");
    this.inputElement.setAttribute("type", "hidden");

    if (options['name'] !== undefined)
        this.inputElement.setAttribute("name", options['name']);

    if (options['id'] != undefined)
        this.wrapperElement.setAttribute("id", options['id']);

    this.inputElement.setAttribute("value", options['initialValue']);

    this.wrapperElement.appendChild(this.inputElement);
}
StyledElements.StyledHiddenField.prototype = new StyledElements.StyledInputElement();

/**
 * @param options Una tabla hash con opciones. Los posibles valores son los
 * siguientes:
 *   - name: nombre que tendrá el elemento input (sólo es necesario cuando se
 *     está creando un formulario).
 *   - class: lista de clases separada por espacios que se asignará al div
 *     principal de este Numeric Field. Independientemente del valor de esta
 *     opción, siempre se le asignará la clase "styled_numeric_field" al div
 *     principal.
 *   - minValue: valor mínimo que permitirá este Numeric Field.
 *   - maxValue: valor máximo que permitirá este Numeric Field.
 *
 */
StyledElements.StyledNumericField = function(options) {
    var defaultOptions = {
        'initialValue': 0,
        'class': '',
        'minValue': null,
        'maxValue': null,
        'inc': 1
    };
    options = Wirecloud.Utils.merge(defaultOptions, options);

    StyledElements.StyledInputElement.call(this, options.initialValue, ['change']);

    this.wrapperElement = document.createElement("div");
    this.wrapperElement.className = "styled_numeric_field";
    this.inputElement = document.createElement("input");
    this.inputElement.setAttribute("type", "text");

    if (options['name'] != undefined)
        this.inputElement.setAttribute("name", options['name']);

    if (options['id'] != undefined)
        this.wrapperElement.setAttribute("id", options['id']);

    if (options.minValue != null) {
        options.minValue = Number(options.minValue);
        this.inputElement.setAttribute("min", options.minValue);
    }

    if (options.maxValue != null) {
        options.maxValue = Number(options.maxValue);
        this.inputElement.setAttribute("max", options.maxValue);
    }
    options.inc = Number(options.inc);

    this.inputElement.setAttribute("value", options['initialValue']);

    this.inputElement.className = Wirecloud.Utils.prependWord(options['class'], "numeric_field");

    var topButton = document.createElement("div");
    topButton.className = "numeric_top_button";
    var bottomButton = document.createElement("div");
    bottomButton.className = "numeric_bottom_button";

    var inc = function(element, inc) {
        var value = Number(element.value);
        if (!isNaN(value)) {
            value = Math.round((value + inc) * 100) / 100;

            // Check for max & min values
            if ((inc > 0) && options['maxValue'] != null && value > options['maxValue'])
                value = options['maxValue'];
            else if ((inc < 0) && options['minValue'] != null && value < options['minValue'])
                value = options['minValue'];

            element.value = value;
        }
    };

    /* Internal events */
    this.wrapperElement.addEventListener('mousedown', Wirecloud.Utils.stopPropagationListener, true);
    this.wrapperElement.addEventListener('click', Wirecloud.Utils.stopPropagationListener, true);

    topButton.addEventListener("click",
        function(event) {
            if (this.enabled)
                inc(this.inputElement, options.inc);
        }.bind(this),
        true);

    bottomButton.addEventListener("click",
        function(event) {
            if (this.enabled)
                inc(this.inputElement, -options.inc);
        }.bind(this),
        true);

    var div = document.createElement("div");
    div.appendChild(this.inputElement);
    this.wrapperElement.appendChild(div);
    this.wrapperElement.appendChild(topButton);
    this.wrapperElement.appendChild(bottomButton);
}
StyledElements.StyledNumericField.prototype = new StyledElements.StyledInputElement();

StyledElements.StyledNumericField.prototype.getValue = function () {
    return Number(this.inputElement.value);
};

/**
 * Este componente permite agrupar varios CheckBoxes o RadioButtons, con el
 * objetivo de tratarlos como un único campo de entrada, permitiendo obtener y
 * establecer su valor, escuchar eventos de modificación, etc... etc...
 */
StyledElements.ButtonsGroup = function(name_) {
    StyledElements.StyledInputElement.call(this, "", ['change']);

    this.name_ = name_;
    this.buttons = [];
}
StyledElements.ButtonsGroup.prototype = new StyledElements.StyledInputElement();

/**
 * Devuelve el nombre que tiene asignado este ButtonsGroup.
 */
StyledElements.ButtonsGroup.prototype.getName = function() {
    return this.name_;
}

/**
 * @private
 */
StyledElements.ButtonsGroup.prototype.insertButton = function(button) {
    this.buttons[this.buttons.length] = button;
    button.addEventListener('change',
                            function () {
                                var changeHandlers = this.events['change'].dispatch(this);
                            }.bind(this));
}

StyledElements.ButtonsGroup.prototype.getValue = function getValue() {
    var i, result = [];

    if (this.buttons[0] instanceof StyledElements.StyledCheckBox) {

        for (i = 0; i < this.buttons.length; i++) {
            if (this.buttons[i].inputElement.checked) {
                result.push(this.buttons[i].getValue());
            }
        }

    } else {

        for (i = 0; i < this.buttons.length; i++) {
            if (this.buttons[i].inputElement.checked) {
                return [this.buttons[i].getValue()];
            }
        }
    }

    return result;
}

StyledElements.ButtonsGroup.prototype.setValue = function(newValue) {
    if (newValue == null) {
        newValue = [];
    } else if (typeof newValue === 'string') {
        newValue = [newValue];
    }

    for (var i = 0; i < this.buttons.length; i++) {
        if (newValue.indexOf(this.buttons[i].inputElement.value) !== -1) {
            this.buttons[i].setValue(true);
        } else {
            this.buttons[i].setValue(false);
        }
    }
}

StyledElements.ButtonsGroup.prototype.reset = function() {
    for (var i = 0; i < this.buttons.length; i++) {
        this.buttons[i].reset();
    }
}

/**
 * Devuelve una lista de los elementos StyledCheckBox o StyledRadioButton
 * seleccionados. En caso de que la selección este vacía, este método devolverá
 * una lista vacía y en caso de que este ButtonGroup este formado por
 * StyledRadioButtons, la selección será como mucho de un elemento.
 */
StyledElements.ButtonsGroup.prototype.getSelectedButtons = function() {
    if (this.buttons.length === 0) {
        return [];
    }

    if (this.buttons[0] instanceof StyledElements.StyledCheckBox) {
        var result = [];

        for (var i = 0; i < this.buttons.length; i++) {
            if (this.buttons[i].inputElement.checked)
                result[result.length] = this.buttons[i];
        }

        return result;
    } else {
        for (var i = 0; i < this.buttons.length; i++) {
            if (this.buttons[i].inputElement.checked)
                return [this.buttons[i]];
        }
        return [];
    }
}

/**
 *
 */
StyledElements.StyledRadioButton = function StyledRadioButton(options) {
    var defaultOptions = {
        'initiallyChecked': false,
        'class': '',
        'group': null,
        'value': null
    };
    options = Wirecloud.Utils.merge(defaultOptions, options);

    StyledElements.StyledInputElement.call(this, options.initiallyChecked, ['change']);

    this.wrapperElement = document.createElement("input");

    this.wrapperElement.setAttribute("type", "radio");
    if (options.value != null) {
        this.wrapperElement.setAttribute("value", options.value);
    }
    this.inputElement = this.wrapperElement;

    if (options['name'] != null) {
        this.inputElement.setAttribute("name", options['name']);
    }

    if (options['id'] != null) {
        this.wrapperElement.setAttribute("id", options['id']);
    }

    if (options['initiallyChecked'] == true)
        this.inputElement.setAttribute("checked", true);

    if (options.group instanceof StyledElements.ButtonsGroup) {
        this.wrapperElement.setAttribute("name", options.group.getName());
        options.group.insertButton(this);
    } else if (typeof options.group === 'string') {
        this.wrapperElement.setAttribute("name", options.group);
    }

    /* Internal events */
    this.inputElement.addEventListener('mousedown', Wirecloud.Utils.stopPropagationListener, true);
    this.inputElement.addEventListener('click', Wirecloud.Utils.stopPropagationListener, true);
    this.inputElement.addEventListener('change',
                                function () {
                                    if (this.enabled)
                                        this.events['change'].dispatch(this);
                                }.bind(this),
                                true);
}
StyledElements.StyledRadioButton.prototype = new StyledElements.StyledInputElement();

StyledElements.StyledRadioButton.prototype.insertInto = function (element, refElement) {
    var checked = this.inputElement.checked; // Necesario para IE
    StyledElements.StyledElement.prototype.insertInto.call(this, element, refElement);
    this.inputElement.checked = checked; // Necesario para IE
}

StyledElements.StyledRadioButton.prototype.reset = function() {
    this.inputElement.checked = this.defaultValue;
}

StyledElements.StyledRadioButton.prototype.setValue = function(newValue) {
    this.inputElement.checked = newValue;
}

/**
 * El componente Styled HPaned crea dos paneles separados por un separador y
 * que permite redimensionar los dos paneles a la vez con el objetivo de que
 * siguan ocupando el mismo espacio en conjunto.
 *
 * @param options Opciones admitidas:
 *                -{Number} handlerPosition Indica la posición en la que estará
 *                 el separador inicialmente. Esta posición deberá ir indicada
 *                 en porcentajes. Valor por defecto: 50.
 *                -{Number} leftMinWidth Indica el tamaño mínimo que tendrá el
 *                 panel izquierdo del componente. Este tamaño mínimo tiene que
 *                 ir en pixels.
 *                -{Number} rightMinWidth Indica el tamaño mínimo que tendrá el
 *                 panel derecho del componente. Este tamaño mínimo tiene que
 *                 ir en pixels.
 */
StyledElements.StyledHPaned = function(options) {
    StyledElements.StyledElement.call(this, []);

    var defaultOptions = {
        'class': '',
        'full': true,
        'handlerPosition': 50,
        'leftContainerOptions': {'class': ''},
        'leftMinWidth': 0,
        'rightMinWidth': 0,
        'rightContainerOptions': {'class': ''}
    };
    options = Wirecloud.Utils.merge(defaultOptions, options);

    this.wrapperElement = document.createElement("div");
    this.wrapperElement.className = Wirecloud.Utils.prependWord(options['class'], "hpaned");

    /* Force leftpanel class */
    options.leftContainerOptions['class'] = Wirecloud.Utils.prependWord(options.leftContainerOptions['class'], 'leftpanel');
    options.leftContainerOptions['useFullHeight'] = true;
    this.leftPanel = new StyledElements.Container(options.leftContainerOptions);

    this.handler = document.createElement("div");
    this.handler.className = "handler";

    /* Force rightpanel class */
    options.rightContainerOptions['class'] = Wirecloud.Utils.prependWord(options.rightContainerOptions['class'], 'rightpanel');
    options.leftContainerOptions['useFullHeight'] = true;
    this.rightPanel = new StyledElements.Container(options.rightContainerOptions);

    this.leftPanel.insertInto(this.wrapperElement);
    this.wrapperElement.appendChild(this.handler);
    this.rightPanel.insertInto(this.wrapperElement);

    this.handlerPosition = options['handlerPosition'];
    this.leftMinWidth = options['leftMinWidth'];
    this.rightMinWidth = options['rightMinWidth'];

    /* Process other options */
    if (options['name'] !== undefined)
        this.inputElement.setAttribute("name", options['name']);

    if (options['id'] != undefined)
        this.wrapperElement.setAttribute("id", options['id']);

    if (options['full'])
        this.wrapperElement.classList.add('full');

    /*
     * Code for handling internal hpaned events
     */
    var hpaned = this;
    var xStart, handlerPosition, hpanedWidth;

    function endresize(e) {
        document.oncontextmenu = null; //reenable context menu
        document.onmousedown = null; //reenable text selection

        document.removeEventListener("mouseup", endresize, true);
        document.removeEventListener("mousemove", resize, true);

        hpaned.repaint(false);

        hpaned.handler.addEventListener("mousedown", startresize, true);
    }

    function resize(e) {
        var screenX = parseInt(e.screenX);
        xDelta = xStart - screenX;
        xStart = screenX;
        handlerPosition = hpanedWidth * (handlerPosition / 100);
        handlerPosition -= xDelta;
        handlerPosition = (handlerPosition / hpanedWidth) * 100;
        if (handlerPosition > 100)
            hpaned.handlerPosition = 100;
        else if (handlerPosition < 0)
            hpaned.handlerPosition = 0;
        else
            hpaned.handlerPosition = handlerPosition;

        hpaned.repaint(true);
    }

    function startresize(e) {
        document.oncontextmenu = function() { return false; }; //disable context menu
        document.onmousedown = function() { return false; }; //disable text selection
        hpaned.handler.removeEventListener("mousedown", startresize, true);

        xStart = parseInt(e.screenX);
        hpanedWidth = hpaned.wrapperElement.parentNode.offsetWidth - 5;
        handlerPosition = hpaned.handlerPosition;

        document.addEventListener("mousemove", resize, true);
        document.addEventListener("mouseup", endresize, true);
    }

    hpaned.handler.addEventListener("mousedown", startresize, true);
}
StyledElements.StyledHPaned.prototype = new StyledElements.StyledElement();

StyledElements.StyledHPaned.prototype.insertInto = function (element, refElement) {
    StyledElements.StyledElement.prototype.insertInto.call(this, element, refElement);

    this.repaint();
    window.addEventListener("resize",
                            this.repaint.bind(this),
                            true);
}

StyledElements.StyledHPaned.prototype.getLeftPanel = function () {
    return this.leftPanel;
}

StyledElements.StyledHPaned.prototype.getRightPanel = function () {
    return this.rightPanel;
}

StyledElements.StyledHPaned.prototype.repaint = function(temporal) {
    temporal = temporal !== undefined ? temporal: false;

    var height = this._getUsableHeight();
    if (height == null)
        return; // nothing to do

    // Height
    this.wrapperElement.style.height = (height + "px");

    // Width
    this.wrapperElement.style.width = "";

    var minWidth = this.leftMinWidth + this.rightMinWidth + this.handler.offsetWidth;
    var width = this._getUsableWidth() - this.handler.offsetWidth;
    if (width < minWidth) {
        width = minWidth;
        this.wrapperElement.style.width = width + "px";
    }

    var handlerMiddle = Math.floor(width * (this.handlerPosition / 100));

    var newLeftPanelWidth = handlerMiddle;
    if (newLeftPanelWidth <  this.leftMinWidth) {
        handlerMiddle += this.leftMinWidth - newLeftPanelWidth;
        newLeftPanelWidth = this.leftMinWidth;
    }

    var newRightPanelWidth = width - handlerMiddle;
    if (newRightPanelWidth <  this.rightMinWidth) {
        handlerMiddle -= this.rightMinWidth - newRightPanelWidth;
        newRightPanelWidth = this.rightMinWidth;
        newLeftPanelWidth = handlerMiddle;
    }

    /* Real width update */
    this.leftPanel.wrapperElement.style.width = newLeftPanelWidth + "px";
    this.rightPanel.wrapperElement.style.width = newRightPanelWidth + "px";
    this.handler.style.left = handlerMiddle + "px";

    /* Propagate resize event */
    this.leftPanel.repaint(temporal);
    this.rightPanel.repaint(temporal);
}

/**
 * Este compontente representa a un tab de un notebook.
 */
StyledElements.Tab = function(id, notebook, options) {
    if (arguments.length == 0) {
        return;
    }

    if (!(notebook instanceof StyledElements.StyledNotebook)) {
        throw new Error("Invalid notebook argument");
    }

    var defaultOptions = {
        'closable': true,
        'containerOptions': {},
        'name': ''
    };
    options = Wirecloud.Utils.merge(defaultOptions, options);
    // Work around common typo
    if (options.closeable) {
        options.closable = options.closeable;
    }
    options['useFullHeight'] = true;

    this.tabId = id;
    this.notebook = notebook;

    this.tabElement = document.createElement("div");
    this.tabElement.className = "tab";
    this.name = document.createElement('span');
    this.tabElement.appendChild(this.name);

    /* call to the parent constructor */
    StyledElements.Container.call(this, options['containerOptions'], ['show', 'hide', 'close']);

    this.wrapperElement.classList.add("tab");
    this.wrapperElement.classList.add("hidden");

    this.tabElement.addEventListener("click",
                                function () {
                                    this.notebook.goToTab(this.tabId);
                                }.bind(this),
                                false);


    /* Process options */
    if (options.closable) {
        var closeButton = new StyledElements.StyledButton({
            text: "X",
            plain: true,
            'class': "close_button",
            title: 'Close Tab'
        });
        closeButton.insertInto(this.tabElement);

        closeButton.addEventListener("click",
                                     this.close.bind(this),
                                     false);
    }

    this.title = options.title;
    this.rename(options.name);
}
StyledElements.Tab.prototype = new StyledElements.Container({extending: true});

/**
 * Elimina este Tab del notebook al que está asociado.
 */
StyledElements.Tab.prototype.close = function() {
    this.notebook.removeTab(this.tabId);
}

/**
 * Establece el texto que se mostrará dentro de la pestaña que se mostrará en
 * <code>notebook</code> y que representará al contenido de este
 * <code>Tab</code>.
 */
StyledElements.Tab.prototype.rename = function(newName) {
    this.nameText = newName;
    this.name.textContent = this.nameText;

    this._updateTitle();
}

/**
 * Establece el texto que se mostrará, mediante un dialogo popup, cuando el
 * puntero del ratón este encima de la pestaña simulando al atributo "title" de
 * los elementos HTML.
 */
StyledElements.Tab.prototype.setTitle = function(newTitle) {
    this.title = newTitle;

    this._updateTitle();
};

StyledElements.Tab.prototype._updateTitle = function() {
    if (typeof this.title === 'undefined' || this.title === null) {
        this.tabElement.setAttribute('title', this.nameText);
    } else {
        this.tabElement.setAttribute('title', this.title);
    }
}

/**
 * Establece el icono de este Tab. En caso de no pasar un icono del notebook al
 * que está asociado.
 */
StyledElements.Tab.prototype.setIcon = function(iconURL) {
    if (iconURL == null) {
        if (this.tabIcon != null) {
            Wirecloud.Utils.removeFromParent(this.tabIcon);
            this.tabIcon = null;
        }
        return;
    }

    if (this.tabIcon == null) {
        this.tabIcon = document.createElement('img');
        this.tabElement.insertBefore(this.tabIcon, this.tabElement.firstChild);
    }
    this.tabIcon.src = iconURL;
}

StyledElements.Tab.prototype.setVisible = function (newStatus) {
    if (newStatus) {
        this.tabElement.classList.add("selected");
        this.wrapperElement.classList.remove("hidden");
        this.repaint(false);
        this.events['show'].dispatch(this);
    } else {
        this.tabElement.classList.remove("selected");
        this.wrapperElement.classList.add("hidden");
        this.events['hide'].dispatch(this);
    }
}

StyledElements.Tab.prototype.getId = function() {
    return this.tabId;
}

/**
 * TODO change this.
 */
StyledElements.Tab.prototype.getTabElement = function() {
    return this.tabElement;
}

/**
 * @experimental
 *
 * Permite ejecutar secuencialmente distintos comandos. Dado que javascript no
 * tiene un interfaz para manejo de hilos, esto realmente sólo es necesario en
 * los casos en los que la concurrencia provenga a través de alguno de los
 * mecanismos de señales soportados por javascript (de momento, estos son los
 * eventos, los temporizadores y las peticiones asíncronas mediante el objeto
 * XMLHttpRequest).
 */
var CommandQueue = function (context, initFunc, stepFunc) {
    var running = false;
    var elements = new Array();
    var step = 0;
    var stepTimes = null;

    function doStep() {
        if (stepFunc(step, context)) {
            var timeDiff = stepTimes[step] - (new Date()).getTime();
            if (timeDiff < 0)
                timeDiff = 0

            step++;
            setTimeout(doStep, timeDiff);
        } else {
            doInit()
        }
    }

    function doInit() {
        var command;
        do {
            command = elements.shift();
        } while (command != undefined && !(stepTimes = initFunc(context, command)));

        if (command != undefined) {
            step = 0;
            var timeDiff = stepTimes[step] - (new Date()).getTime();
            if (timeDiff < 0)
                timeDiff = 0
            setTimeout(doStep, timeDiff);
        } else {
            running = false;
        }
    }

    /**
     * Añade un comando a la cola de procesamiento. El comando será procesado
     * despues de que se procesen todos los comandos añadidos anteriormente.
     *
     * @param command comando a añadir a la cola de procesamiento. El tipo de
     * este párametro tiene que ser compatible con las funciones initFunc y
     * stepFunc pasadas en el constructor.
     */
    this.addCommand = function(command) {
        if (command == undefined)
            return;

        elements.push(command);

        if (!running) {
            running = true;
            doInit();
        }
    }
}

/**
 * Este compontente representa al contenedor para una alternativa usable por el
 * componente StyledAlternatives.
 */
StyledElements.Alternative = function(id, options) {
    var defaultOptions;

    if (arguments.length == 0) {
        return;
    }

    defaultOptions = {
        useFullHeight: true
    };
    options = Wirecloud.Utils.merge(defaultOptions, options);

    this.altId = id;

    /* call to the parent constructor */
    StyledElements.Container.call(this, options, ['show', 'hide']);

    this.wrapperElement.classList.add("hidden"); // TODO
}
StyledElements.Alternative.prototype = new StyledElements.Container({extending: true});

StyledElements.Alternative.prototype.setVisible = function (newStatus) {
    if (newStatus) {
        this.wrapperElement.classList.remove("hidden");
        this.repaint(false);
        this.events['show'].dispatch(this);
    } else {
        this.wrapperElement.classList.add("hidden");
        this.repaint(false);
        this.events['hide'].dispatch(this);
    }
}

StyledElements.Alternative.prototype.isVisible = function (newStatus) {
    return !this.wrapperElement.classList.contains("hidden");
};

StyledElements.Alternative.prototype.getId = function() {
    return this.altId;
}

/**
 *
 */
StyledElements.DynamicMenuItems = function() {
}

StyledElements.DynamicMenuItems.prototype.build = function() {
    return [];
}
