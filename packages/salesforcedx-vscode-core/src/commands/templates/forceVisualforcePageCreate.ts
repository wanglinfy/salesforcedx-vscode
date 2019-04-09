/*
 * Copyright (c) 2019, salesforce.com, inc.
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
  SelectFileName,
  SelectOutputDir,
  SfdxCommandlet,
  SfdxWorkspaceChecker
} from '../commands';
import {
  BaseTemplateCommand,
  DefaultPathStrategy,
  FilePathExistsChecker2
} from './baseTemplateCommand';
import {
  VISUALFORCE_PAGE_DIRECTORY,
  VISUALFORCE_PAGE_EXTENSION
} from './metadataTypeConstants';

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

  public sourcePathStrategy = new DefaultPathStrategy();

  public getDefaultDirectory() {
    return VISUALFORCE_PAGE_DIRECTORY;
  }

  public getFileExtension(): string {
    return VISUALFORCE_PAGE_EXTENSION;
  }
}

const fileNameGatherer = new SelectFileName();
const outputDirGatherer = new SelectOutputDir(VISUALFORCE_PAGE_DIRECTORY);

export async function forceVisualforcePageCreate() {
  const commandlet = new SfdxCommandlet(
    new SfdxWorkspaceChecker(),
    new CompositeParametersGatherer<DirFileNameSelection>(
      fileNameGatherer,
      outputDirGatherer
    ),
    new ForceVisualForcePageCreateExecutor(),
    new FilePathExistsChecker2(
      [VISUALFORCE_PAGE_EXTENSION],
      new DefaultPathStrategy(),
      nls.localize('visualforce_page_message_name')
    )
  );
  await commandlet.run();
}
