/*
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {
  Command,
  SfdxCommandBuilder
} from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { DirFileNameSelection } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { nls } from '../../messages';
import {
  CompositeParametersGatherer,
  FilePathExistsChecker,
  SelectFileName,
  SelectOutputDir,
  SfdxCommandlet,
  SfdxWorkspaceChecker
} from '../commands';
import { BaseTemplateCommand } from './baseTemplateCommand';

const VF_PAGE_EXTENSION = '.page';

class ForceVisualForcePageCreateExecutor extends BaseTemplateCommand {
  public build(data: DirFileNameSelection): Command {
    return new SfdxCommandBuilder()
      .withDescription(nls.localize('force_visualforce_page_create_text'))
      .withArg('force:visualforce:page:create')
      .withFlag('--pagename', data.fileName)
      .withFlag('--label', data.fileName)
      .withFlag('--outputdir', data.outputdir)
      .withLogName('force_visualforce_page_create')
      .build();
  }

  public createSubDirectory(): boolean {
    return false;
  }

  public getFileExtension(): string {
    return VF_PAGE_EXTENSION;
  }
}

const workspaceChecker = new SfdxWorkspaceChecker();
const fileNameGatherer = new SelectFileName();
const filePathExistsChecker = new FilePathExistsChecker(VF_PAGE_EXTENSION);

export async function forceVisualforcePageCreate() {
  const outputDirGatherer = new SelectOutputDir('pages');
  const parameterGatherer = new CompositeParametersGatherer<
    DirFileNameSelection
  >(fileNameGatherer, outputDirGatherer);
  const commandlet = new SfdxCommandlet(
    workspaceChecker,
    parameterGatherer,
    new ForceVisualForcePageCreateExecutor(),
    filePathExistsChecker
  );
  await commandlet.run();
}
