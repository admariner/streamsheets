/********************************************************************************
 * Copyright (c) 2020 Cedalo AG
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 ********************************************************************************/
const Node = require('./Node');
const Expression = require('../expr/Expression');
const Attribute = require('../attr/Attribute');
const StringAttribute = require('../attr/StringAttribute');
const CellRange = require('./CellRange');

module.exports = class SheetButtonNode extends Node {
	constructor() {
		super();

		this.getFormat().setLineCorner(150);
		// this.getFormat().setLineColor('#AAAAAA');
		// this.getFormat().setFillColor('#DDDDDD');
		this.getTextFormat().setFontSize(9);
		this.getItemAttributes().setContainer(false);
		this.addAttribute(new StringAttribute('title', 'Button'));
		this.addAttribute(new Attribute('value', new Expression(false)));

		this.showFeedback = true;
	}

	newInstance() {
		return new SheetButtonNode();
	}

	getItemType() {
		return 'sheetbuttonnode';
	}

	_assignName(id) {
		const name = this.getGraph().getUniqueName('Button');
		this.setName(name);
	}

	getSheet() {
		let sheet = this;

		while (sheet && !sheet.getCellDescriptors) {
			sheet = sheet.getParent();
		}

		return sheet;
	}

	getValue() {
		const  value = this.getAttributeValueAtPath('value');

		if (value === 1 || value === '1' || value === true) {
			return true;
		}

		return false;
	}

	isMoveable() {
		if (
			this.getGraph()
				.getMachineContainer()
				.getMachineState()
				.getValue() === 0
		) {
			return false;
		}

		return super.isMoveable();
	}

	isAddLabelAllowed() {
		return false;
	}
};
