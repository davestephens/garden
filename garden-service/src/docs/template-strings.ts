/*
 * Copyright (C) 2018 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { resolve } from "path"
import { renderSchemaDescriptionYaml, normalizeSchemaDescriptions, TEMPLATES_DIR, Description } from "./config"
import { ProjectConfigContext, ModuleConfigContext, ProviderConfigContext } from "../config/config-context"
import { readFileSync, writeFileSync } from "fs"
import handlebars from "handlebars"
import { GARDEN_SERVICE_ROOT } from "../constants"

export function writeTemplateStringReferenceDocs(docsRoot: string) {
  const referenceDir = resolve(docsRoot, "reference")
  const outputPath = resolve(referenceDir, "template-strings.md")

  const projectDescriptions = normalizeSchemaDescriptions(ProjectConfigContext.getSchema().describe() as Description)
  const projectContext = renderSchemaDescriptionYaml(projectDescriptions, {
    renderRequired: false,
  })

  const providerDescriptions = normalizeSchemaDescriptions(ProviderConfigContext.getSchema().describe() as Description)
  const providerContext = renderSchemaDescriptionYaml(providerDescriptions, {
    renderRequired: false,
  })

  const moduleDescriptions = normalizeSchemaDescriptions(ModuleConfigContext.getSchema().describe() as Description)
  const moduleContext = renderSchemaDescriptionYaml(moduleDescriptions, {
    renderRequired: false,
  })

  const templatePath = resolve(TEMPLATES_DIR, "template-strings.hbs")
  const template = handlebars.compile(readFileSync(templatePath).toString())
  const markdown = template({ projectContext, providerContext, moduleContext })

  writeFileSync(outputPath, markdown)
}

if (require.main === module) {
  writeTemplateStringReferenceDocs(resolve(GARDEN_SERVICE_ROOT, "..", "docs"))
}
