/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MainThreadTestCollection } from 'vs/workbench/contrib/testing/common/mainThreadTestCollection';
import { SingleUseTestCollection } from 'vs/workbench/contrib/testing/common/ownedTestCollection';
import { TestsDiff } from 'vs/workbench/contrib/testing/common/testCollection';
import { testStubs } from 'vs/workbench/contrib/testing/common/testStubs';

export class TestSingleUseCollection extends SingleUseTestCollection {
	public get itemToInternal() {
		return this.testItemToInternal;
	}

	public get currentDiff() {
		return this.diff;
	}

	public setDiff(diff: TestsDiff) {
		this.diff = diff;
	}
}

/**
 * Gets a main thread test collection initialized with the given set of
 * roots/stubs.
 */
export const getInitializedMainTestCollection = async (root = testStubs.nested()) => {
	const c = new MainThreadTestCollection(async (t, l) => singleUse.expand(t.testId, l));
	const singleUse = new TestSingleUseCollection('testController');
	singleUse.addItem(root, 'provider');
	await singleUse.expand('id-root', Infinity);
	c.apply(singleUse.collectDiff());
	return c;
};
